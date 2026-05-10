    package edu.cit.laurente.laundryhub.shared.security;

    import java.util.Date;
    import java.util.function.Function;

    import javax.crypto.SecretKey;

    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.stereotype.Service;

import edu.cit.laurente.laundryhub.shared.entity.User;
import io.jsonwebtoken.Claims;
    import io.jsonwebtoken.Jwts;
    import io.jsonwebtoken.security.Keys;

    @Service
    public class JwtService {

        @Value("${jwt.secret:mySecretKeyForJwtTokenGenerationAndValidationPurpose}")
        private String secretKey;

        @Value("${jwt.expiration:86400000}")
        private long jwtExpirationMs;

        private SecretKey getSigningKey() {
            return Keys.hmacShaKeyFor(secretKey.getBytes());
        }

        public String generateToken(User user) {
            return Jwts.builder()
                    .subject(user.getEmail())
                    .claim("userId", user.getId())
                    .claim("name", user.getName())
                    .claim("role", user.getRole())
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                    .signWith(getSigningKey())
                    .compact();
        }

        // Extract username (email) from token
        public String extractUsername(String token) {
            return extractClaim(token, Claims::getSubject);
        }

        // Extract specific claim
        public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
            final Claims claims = extractAllClaims(token);
            return claimsResolver.apply(claims);
        }

        // Extract user ID from token
        public Long extractUserId(String token) {
            return extractClaim(token, claims -> claims.get("userId", Long.class));
        }

        // Extract role from token
        public String extractRole(String token) {
            return extractClaim(token, claims -> claims.get("role", String.class));
        }

        // Extract all claims
        private Claims extractAllClaims(String token) {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        }

        // Validate token
        public boolean validateToken(String token) {
            try {
                Claims claims = extractAllClaims(token);
                return !isTokenExpired(claims);
            } catch (Exception e) {
                return false;
            }
        }

        // Check if token is expired
        private boolean isTokenExpired(Claims claims) {
            return claims.getExpiration().before(new Date());
        }
    }

