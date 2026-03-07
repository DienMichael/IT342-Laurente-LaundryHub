package edu.cit.laurente.laundryhub.controller;

import edu.cit.laurente.laundryhub.dto.AuthResponse;
import edu.cit.laurente.laundryhub.dto.LoginRequest;
import edu.cit.laurente.laundryhub.dto.RegisterRequest;
import edu.cit.laurente.laundryhub.entity.User;
import edu.cit.laurente.laundryhub.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);

        AuthResponse response = new AuthResponse(
                true,
                null,
                user.getName(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        String token = authService.login(request);
        User user = authService.getUserByEmail(request.getEmail());

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