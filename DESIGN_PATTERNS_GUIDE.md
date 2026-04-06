# Design Patterns Refactoring - Complete Implementation Guide

## Overview
Your IT342 LaundryHub project has been refactored to implement all requested design patterns:

### 1. **Creational Patterns**

#### Builder Pattern (User Entity)
**Location:** `entity/User.java`

The `User` entity now includes a static inner `Builder` class for flexible object construction:

```java
// Usage example:
User user = User.builder()
    .name("John Doe")
    .email("john@example.com")
    .passwordHash(encodedPassword)
    .role("CUSTOMER")
    .createdAt(LocalDateTime.now())
    .build();
```

**Benefits:**
- Clean, readable object creation
- Makes code self-documenting
- Handles complex object initialization
- Easy to add optional fields in the future

#### Singleton Pattern (AuthService)
**Location:** `service/AuthService.java`

The `AuthService` is already a singleton through Spring's `@Service` annotation:
- Spring manages a single instance of the service
- Shared across all authentication requests
- Thread-safe by default
- Every login request uses the same service instance

---

### 2. **Structural Patterns**

#### Facade Pattern (AuthFacade)
**Location:** `facade/AuthFacade.java`

A new facade class that orchestrates complex authentication operations:

```java
// Usage in Controller (much cleaner!):
User user = authFacade.registerUser(request);
String token = authFacade.authenticateAndGenerateToken(request);
```

**What AuthFacade handles:**
- Email uniqueness validation
- Password encoding
- User object creation (via Builder pattern)
- Role assignment and validation
- Event publishing (Observer pattern)
- Strategy-based authentication
- Token generation

**Benefits:**
- Controllers are much simpler and cleaner
- Business logic is centralized in one place
- Easy to modify authentication flow without touching controllers
- Better maintainability and testability

#### Decorator Pattern (React HOC - withAuth)
**Location:** `frontend/src/app/components/auth/withAuth.jsx`

A Higher-Order Component that "decorates" private pages with authentication checks:

```jsx
// Usage:
const ProtectedDashboard = withAuth(Dashboard);
const AdminPanel = withAuth(AdminPanel, 'ADMIN');  // With role checking

// In your routing:
<Routes>
  <Route path="/dashboard" element={<ProtectedDashboard />} />
  <Route path="/admin" element={<AdminPanel />} />
</Routes>
```

**What withAuth provides:**
- Automatic redirect to login if not authenticated
- Loading state while checking authentication
- Optional role-based access control
- Clean component wrapping without code duplication

---

### 3. **Behavioral Patterns**

#### Observer Pattern (Registration Event)
**Locations:**
- `event/UserRegisteredEvent.java` - The event published when a user registers
- `listener/RegistrationEventListener.java` - Listener that observes the event

**How it works:**
1. User completes registration via `AuthFacade.registerUser()`
2. Facade publishes `UserRegisteredEvent` using Spring's `ApplicationEventPublisher`
3. `RegistrationEventListener` automatically receives and processes the event

**Current listeners in the event:**
- Send welcome email (placeholder for email service)
- Log registration activity (placeholder for audit service)
- Initialize user profile (placeholder for profile service)

**Benefits:**
- Decouples registration from post-registration actions
- Easy to add new listeners without modifying existing code
- Email, logging, and profile setup happen independently
- Better separation of concerns

**Example - Add a new listener:**
```java
@Component
public class UserNotificationListener {
    @EventListener
    public void onUserRegistered(UserRegisteredEvent event) {
        // Send SMS notification
        // Send push notification
        // etc.
    }
}
```

#### Strategy Pattern (Authentication)
**Locations:**
- `service/strategy/AuthenticationStrategy.java` - Interface defining the strategy
- `service/strategy/StandardAuthenticationStrategy.java` - Implementation for email/password

**How it works:**
1. `AuthService.login()` uses the injected `AuthenticationStrategy`
2. Currently uses `StandardAuthenticationStrategy` for traditional login
3. Easy to add new strategies without changing existing code

**Benefits:**
- Can add OAuth, social login, biometric auth without modifying AuthService
- Each strategy is independent and testable
- Clean separation of authentication methods

**Example - Add new strategy:**
```java
@Component
public class OAuthAuthenticationStrategy implements AuthenticationStrategy {
    @Override
    public User authenticate(LoginRequest request) {
        // OAuth logic here
        return user;
    }

    @Override
    public String getStrategyType() {
        return "OAUTH";
    }
}
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Controller                              │
│              (Simple, clean, HTTP-focused)                   │
└─────────────────────┬───────────────────────────────────────┘
                      │ uses
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   AuthFacade                                 │
│        (Orchestrates authentication flow)                    │
└────┬──────────┬──────────┬─────────────┬────────────────────┘
     │          │          │             │
     ▼          ▼          ▼             ▼
┌────────┐  ┌───────┐  ┌──────┐  ┌──────────────┐
│UserSvc │  │PassEnc│  │JwtSvc│  │Strategy      │
└────────┘  └───────┘  └──────┘  │(pluggable)   │
                                  └──────────────┘
     │
     └─────▶ publishes ──▶ UserRegisteredEvent
                              │
                              ▼
                    RegistrationEventListener
                    (post-registration tasks)
```

---

## File Changes Summary

### Backend Changes:

| File | Change | Pattern |
|------|--------|---------|
| `entity/User.java` | Added Builder inner class | Builder |
| `service/AuthService.java` | Inject UserRepository, use strategy for login | Singleton + Strategy |
| `service/strategy/AuthenticationStrategy.java` | NEW: Interface for auth strategies | Strategy |
| `service/strategy/StandardAuthenticationStrategy.java` | NEW: Standard email/password implementation | Strategy |
| `facade/AuthFacade.java` | NEW: Orchestrates authentication operations | Facade |
| `event/UserRegisteredEvent.java` | NEW: Event for user registration | Observer |
| `listener/RegistrationEventListener.java` | NEW: Listens for registration events | Observer |
| `controller/AuthController.java` | Updated to use AuthFacade instead of AuthService | Facade |

### Frontend Changes:

| File | Change | Pattern |
|------|--------|---------|
| `components/auth/withAuth.jsx` | NEW: HOC for protecting routes | Decorator |

---

## Testing the Implementation

### Backend Testing:

1. **Test Registration Flow:**
   ```bash
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "John Doe",
       "email": "john@example.com",
       "password": "password123",
       "role": "CUSTOMER"
     }'
   ```
   Expected: Event is published, listener processes it

2. **Test Login Flow:**
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "john@example.com",
       "password": "password123"
     }'
   ```
   Expected: JWT token returned

### Frontend Testing:

1. **Test withAuth HOC:**
   ```jsx
   // Wrap your dashboard component
   const ProtectedDashboard = withAuth(Dashboard);
   
   // Try accessing without login - should redirect to /login
   // Try accessing after login - should render Dashboard
   ```

---

## Future Enhancements

### Easy to implement now with these patterns:

1. **Add Social Login** - Create new `Strategy` implementation
2. **Send Emails** - Implement email service in `RegistrationEventListener`
3. **Multi-factor Authentication** - Create new `Strategy` for 2FA
4. **Admin Dashboard** - Use `withAuth(AdminPanel, 'ADMIN')`
5. **User Profile Feature** - Add listener to initialize profiles on registration
6. **Audit Logging** - Enhance `RegistrationEventListener` with audit events

---

## Key Takeaways

✅ **Builder Pattern** - User entity now has clean, readable construction
✅ **Singleton Pattern** - AuthService is managed as singleton by Spring
✅ **Facade Pattern** - Complex logic hidden behind simple AuthFacade interface
✅ **Decorator Pattern** - React components wrapped with authentication HOC
✅ **Observer Pattern** - Registration triggers automatic listeners
✅ **Strategy Pattern** - Authentication method is pluggable and testable

All changes maintain backward compatibility while enabling future extensibility!
