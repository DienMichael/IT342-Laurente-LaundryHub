package edu.cit.laurente.laundryhub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.laurente.laundryhub.dto.AuthResponse;
import edu.cit.laurente.laundryhub.dto.GoogleTokenRequest;
import edu.cit.laurente.laundryhub.dto.GoogleUserInfo;
import edu.cit.laurente.laundryhub.entity.User;
import edu.cit.laurente.laundryhub.facade.AuthFacade;
import edu.cit.laurente.laundryhub.security.JwtService;
import edu.cit.laurente.laundryhub.service.GoogleTokenService;
import edu.cit.laurente.laundryhub.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class GoogleAuthController {

    @Autowired
    private GoogleTokenService googleTokenService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthFacade authFacade; // not required, but keeps facade usage consistent

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleTokenRequest request) {
        try {
            GoogleUserInfo googleUser = googleTokenService.verifyAndExtractUser(request.getToken());

            // Find or create user
            User user = userService.findByEmail(googleUser.getEmail())
                    .orElseGet(() -> {
                        User u = User.builder()
                                .name(googleUser.getName())
                                .email(googleUser.getEmail())
                                .passwordHash("")
                                .role("CUSTOMER")
                                .createdAt(java.time.LocalDateTime.now())
                                .build();
                        return userService.save(u);
                    });

            String jwtToken = jwtService.generateToken(user);

            return ResponseEntity.ok(new AuthResponse(
                    true,
                    jwtToken,
                    user.getName(),
                    user.getEmail(),
                    user.getRole()
            ));
        } catch (UnsupportedOperationException e) {
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                    .body(new AuthResponse(false, null, null, null, null, e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(false, null, null, null, null, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(false, null, null, null, null, "Invalid Google token"));
        }
    }
}

