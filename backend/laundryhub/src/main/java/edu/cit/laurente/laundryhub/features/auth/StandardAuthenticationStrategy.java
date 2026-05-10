package edu.cit.laurente.laundryhub.features.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import edu.cit.laurente.laundryhub.shared.entity.User;

/**
 * Standard Authentication Strategy Implementation
 * Handles traditional email/password authentication
 */
@Component
public class StandardAuthenticationStrategy implements AuthenticationStrategy {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User authenticate(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        return user;
    }

    @Override
    public String getStrategyType() {
        return "STANDARD";
    }
}
