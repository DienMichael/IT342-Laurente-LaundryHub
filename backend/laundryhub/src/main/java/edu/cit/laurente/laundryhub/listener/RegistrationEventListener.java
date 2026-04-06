package edu.cit.laurente.laundryhub.listener;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import edu.cit.laurente.laundryhub.event.UserRegisteredEvent;

/**
 * Observer Pattern: Listener (Observer) for user registration events
 * This class observes UserRegisteredEvent and performs actions like:
 * - Sending welcome emails
 * - Logging registration activity
 * - Initializing user profiles
 */
@Component
public class RegistrationEventListener {

    @EventListener
    public void onUserRegistered(UserRegisteredEvent event) {
        // Handle the user registration event
        // This method is called automatically when a UserRegisteredEvent is published

        // Example implementations (these are placeholders for your actual logic):
        
        // 1. Send welcome email
        sendWelcomeEmail(event.getUser());
        
        // 2. Log registration activity
        logRegistrationActivity(event.getUser());
        
        // 3. Initialize user profile
        initializeUserProfile(event.getUser());
    }

    private void sendWelcomeEmail(edu.cit.laurente.laundryhub.entity.User user) {
        // TODO: Implement email service integration
        System.out.println("Sending welcome email to: " + user.getEmail());
        // Example: emailService.sendWelcomeEmail(user.getEmail(), user.getName());
    }

    private void logRegistrationActivity(edu.cit.laurente.laundryhub.entity.User user) {
        // TODO: Implement logging and audit trail
        System.out.println("Logging registration for user: " + user.getEmail() + " with role: " + user.getRole());
        // Example: auditService.logUserRegistration(user);
    }

    private void initializeUserProfile(edu.cit.laurente.laundryhub.entity.User user) {
        // TODO: Implement profile initialization (create default settings, preferences, etc.)
        System.out.println("Initializing profile for user: " + user.getEmail());
        // Example: userProfileService.createDefaultProfile(user);
    }
}
