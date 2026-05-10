package edu.cit.laurente.laundryhub.features.auth;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import edu.cit.laurente.laundryhub.shared.entity.User;
import edu.cit.laurente.laundryhub.shared.security.JwtService;

/**
 * Facade Pattern: Simplifies complex authentication operations
 * 
 * This facade orchestrates multiple services to provide a clean interface for:
 * - User registration (validates, encodes password, saves user, publishes event)
 * - User login (authenticates, generates token)
 * - Retrieving user information
 * 
 * The Controller only needs to call simple methods here instead of juggling
 * multiple service dependencies and business logic.
 */
@Service
public class AuthFacade {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationStrategy authenticationStrategy;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    /**
     * Facade method for user registration
     * Handles validation, user creation, and event publishing
     * 
     * @param request the registration request
     * @return the newly created User
     */
    public User registerUser(RegisterRequest request) {
        // Validate email uniqueness
        if (userService.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Encode password
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // Determine role (default to CUSTOMER)
        String role = request.getRole() != null ? request.getRole().toUpperCase() : "CUSTOMER";
        if (!role.equals("STAFF") && !role.equals("CUSTOMER") && !role.equals("ADMIN")) {
            role = "CUSTOMER";
        }

        // Build and save user using Builder pattern
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(encodedPassword)
                .role(role)
                .createdAt(LocalDateTime.now())
                .build();

        user = userService.save(user);

        // Publish registration event (Observer pattern)
        // Listeners will automatically handle welcome emails, logging, etc.
        eventPublisher.publishEvent(new UserRegisteredEvent(this, user));

        return user;
    }

    /**
     * Facade method for user login
     * Authenticates user and generates JWT token
     * 
     * @param request the login request
     * @return JWT token
     */
    public String authenticateAndGenerateToken(LoginRequest request) {
        // Use Strategy pattern: authenticate using the configured strategy
        User user = authenticationStrategy.authenticate(request);
        
        // Generate JWT token
        return jwtService.generateToken(user);
    }

    /**
     * Get user by email
     * 
     * @param email the user's email
     * @return the User object
     */
    public User getUserByEmail(String email) {
        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
