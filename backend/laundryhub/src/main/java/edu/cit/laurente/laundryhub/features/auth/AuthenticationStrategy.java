package edu.cit.laurente.laundryhub.features.auth;

import edu.cit.laurente.laundryhub.shared.entity.User;

/**
 * Strategy Pattern: Defines different authentication strategies
 * This allows for flexible implementation of various authentication methods
 * (standard login, social login, etc.) without modifying the core service
 */
public interface AuthenticationStrategy {
    
    /**
     * Authenticate a user based on the provided login request
     * @param request the login request containing credentials
     * @return the authenticated user
     * @throws RuntimeException if authentication fails
     */
    User authenticate(LoginRequest request);
    
    /**
     * Get the type/name of this authentication strategy
     * @return the strategy type (e.g., "STANDARD", "OAUTH", etc.)
     */
    String getStrategyType();
}
