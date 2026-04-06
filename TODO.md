# Design Patterns Implementation TODO

## Approved Plan Steps (Sequential)

### 1. Backend Updates - Builder Pattern
- [x] Add manual Builder to `dto/RegisterRequest.java`

### 2. Extract User Operations
- [x] Create `service/UserService.java` (user save/find/exists)
- [ ] Update `service/AuthService.java` to use UserService

### 3. Strategy Pattern
- [ ] Create `strategy/AuthenticationStrategy.java` (interface)
- [ ] Create `strategy/LocalPasswordStrategy.java` (impl)
- [ ] Update `service/AuthService.java` to inject/use strategy

### 4. Observer Pattern
- [ ] Create `event/UserRegisteredEvent.java`
- [ ] Create `event/RegistrationListener.java` (@EventListener, simulate email/log)
- [ ] Update register flow (AuthService/Facade) to publish event via ApplicationEventPublisher

### 5. Facade Pattern
- [ ] Create `service/AuthFacade.java` (orchestrates UserService, PasswordEncoder, JwtService)
- [ ] Update `controller/AuthController.java` to use AuthFacade

### 6. Frontend - Decorator Pattern
- [ ] Create `frontend/laundry-app/src/app/context/withAuth.jsx` (HOC)
- [ ] Create example `frontend/laundry-app/src/app/components/Dashboard.jsx`
- [ ] Demo usage (e.g. in App.js or routes)

### 7. Fixes & Tests
- [ ] Fix frontend API_BASE_URL: change /api/v1 to /api
- [ ] Backend: mvn clean compile
- [ ] Test: register/login, check console for event log, HOC redirect

**Current Progress: Starting Step 1**

