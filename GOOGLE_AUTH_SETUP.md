# Google OAuth Authentication Setup Guide

This guide will help you set up Google OAuth authentication for the LaundryHub application.

## Frontend Setup (Already Done)

The frontend has been updated with Google Sign-In functionality:
- Added Google Login button to Login page
- Added Google Sign-Up button to Register page
- Integrated with `@react-oauth/google` library
- Created `googleLogin()` method in AuthContext

## Backend Setup Required

### 1. Add Google OAuth Dependency (Spring Boot)

Add this to your `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-oauth2-jose</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-oauth2-resource-server</artifactId>
</dependency>
<dependency>
    <groupId>com.google.auth</groupId>
    <artifactId>google-auth-library-oauth2-http</artifactId>
    <version>1.11.0</version>
</dependency>
```

### 2. Create Google OAuth Controller

Add this endpoint to your `AuthController`:

```java
@PostMapping("/auth/google")
public ResponseEntity<?> googleLogin(@RequestBody GoogleTokenRequest request) {
    try {
        // Verify Google token and get user info
        GoogleIdToken.Payload payload = verifyGoogleToken(request.getToken());
        
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        
        // Find or create user
        User user = userRepository.findByEmail(email)
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(name);
                newUser.setRole("CUSTOMER");
                newUser.setPassword(""); // No password for OAuth users
                return userRepository.save(newUser);
            });
        
        // Generate JWT token
        String jwtToken = jwtTokenProvider.generateToken(user);
        
        return ResponseEntity.ok(new AuthResponse(
            jwtToken,
            user.getName(),
            user.getEmail(),
            user.getRole()
        ));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponse("Invalid Google token"));
    }
}

private GoogleIdToken.Payload verifyGoogleToken(String token) throws Exception {
    GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
        new NetHttpTransport(),
        new GsonFactory()
    )
    .setAudience(Collections.singletonList("YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"))
    .build();
    
    GoogleIdToken idToken = verifier.verify(token);
    if (idToken != null) {
        return idToken.getPayload();
    } else {
        throw new Exception("Invalid token");
    }
}
```

### 3. Create Request/Response DTOs

```java
public class GoogleTokenRequest {
    private String token;
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}

public class AuthResponse {
    private String accessToken;
    private String name;
    private String email;
    private String role;
    
    public AuthResponse(String accessToken, String name, String email, String role) {
        this.accessToken = accessToken;
        this.name = name;
        this.email = email;
        this.role = role;
    }
    
    // Getters and Setters
}
```

## Frontend Configuration

### 1. Get Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing one)
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth Client ID"
5. Select "Web application"
6. Add Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production domain
7. Add Authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - Your production domain
8. Copy your Client ID

### 2. Create `.env.local` file in frontend directory

```
REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
REACT_APP_API_URL=http://localhost:8081
```

Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Google Client ID from step 1.

### 3. Install Dependencies

```bash
cd frontend/laundry-app
npm install
npm start
```

## Testing

1. Go to http://localhost:3000/login
2. Click "Sign In with Google"
3. Sign in with your Google account
4. You should be redirected to the dashboard
5. Test registration with Google on http://localhost:3000/register

## Features

✅ Users can sign up with Google
✅ Users can sign in with Google
✅ Automatic account creation for new Google users
✅ Session persistence across page refreshes
✅ Role-based redirection (customer/staff)

## Troubleshooting

### "CORS error" or "Network error"
- Make sure backend is running on `http://localhost:8081`
- Check `REACT_APP_API_URL` in `.env.local`

### "Invalid Client ID" error
- Verify your Google Client ID is correct in `.env.local`
- Make sure your domain is authorized in Google Cloud Console

### "Invalid token" from backend
- Ensure the Google token verification endpoint is correctly configured
- Verify `YOUR_GOOGLE_CLIENT_ID` in backend matches the frontend client ID

## Security Notes

- Never commit `.env.local` to version control
- Store sensitive keys in environment variables
- Use HTTPS in production
- Validate all tokens on the backend
