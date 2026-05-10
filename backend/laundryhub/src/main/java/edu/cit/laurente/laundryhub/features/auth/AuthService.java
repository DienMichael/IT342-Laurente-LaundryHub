package edu.cit.laurente.laundryhub.features.auth;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import edu.cit.laurente.laundryhub.shared.entity.User;
import edu.cit.laurente.laundryhub.shared.security.JwtService;

/**
 * Singleton Pattern: AuthService is a singleton managed by Spring
 * Every authentication request uses the same instance.
 * 
 * This service is now integrated with:
 * - Strategy Pattern: Uses AuthenticationStrategy for flexible authentication
 * - Builder Pattern: Uses User.builder() for object creation
 * 
 * Note: This service can be used directly, but the Facade pattern
 * (AuthFacade) is the recommended approach in controllers for cleaner separation.
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationStrategy authenticationStrategy;

    /**
     * Register a new user
     * Uses Builder pattern to construct User objects
     * 
     * @param request the registration request
     * @return the created User
     */
    public @NonNull User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        String role = request.getRole() != null ? request.getRole().toUpperCase() : "CUSTOMER";
        if (!role.equals("STAFF") && !role.equals("CUSTOMER") && !role.equals("ADMIN")) {
            role = "CUSTOMER";
        }

        // Using Builder Pattern
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .createdAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }

    /**
     * Login a user using the configured authentication strategy
     * Uses Strategy Pattern for flexible authentication methods
     * 
     * @param request the login request
     * @return JWT token
     */
    public @NonNull String login(LoginRequest request) {
        // Strategy Pattern: Delegate to the strategy implementation
        User user = authenticationStrategy.authenticate(request);
        return jwtService.generateToken(user);
    }

    /**
     * Get User by Email
     * 
     * @param email the user's email
     * @return the User object
     */
    public @NonNull User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}