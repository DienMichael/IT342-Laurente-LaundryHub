package edu.cit.laurente.laundryhub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.laurente.laundryhub.dto.AuthResponse;
import edu.cit.laurente.laundryhub.dto.LoginRequest;
import edu.cit.laurente.laundryhub.dto.RegisterRequest;
import edu.cit.laurente.laundryhub.entity.User;
import edu.cit.laurente.laundryhub.facade.AuthFacade;
import jakarta.validation.Valid;

/**
 * Authentication Controller
 * 
 * This controller uses the Facade Pattern to delegate all complex authentication
 * logic to AuthFacade. This keeps the controller clean and focused on HTTP concerns.
 * 
 * The controller no longer handles:
 * - Password encoding
 * - User creation and validation
 * - Token generation
 * - Event publishing
 * 
 * All of these are handled by AuthFacade, which internally coordinates
 * multiple services following the appropriate design patterns.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthFacade authFacade;

    /**
     * Register a new user
     * Uses Facade Pattern: Controller delegates to AuthFacade which orchestrates the operation
     * 
     * @param request the registration request
     * @return AuthResponse with user details
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        // Facade handles: validation, encoding, saving, event publishing
        User user = authFacade.registerUser(request);

        AuthResponse response = new AuthResponse(
                true,
                null,
                user.getName(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Login a user
     * Uses Facade Pattern: Controller delegates to AuthFacade which orchestrates the operation
     * 
     * @param request the login request
     * @return AuthResponse with JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        // Facade handles: strategy-based authentication, token generation
        String token = authFacade.authenticateAndGenerateToken(request);
        User user = authFacade.getUserByEmail(request.getEmail());

        AuthResponse response = new AuthResponse(
                true,
                token,
                user.getName(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }
}