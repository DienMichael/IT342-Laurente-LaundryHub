package edu.cit.laurente.laundryhub.features.auth;

import org.springframework.context.ApplicationEvent;

import edu.cit.laurente.laundryhub.shared.entity.User;

/**
 * Observer Pattern: This event is published when a new user registers
 * Listeners (Observers) can subscribe to this event to perform actions like:
 * - Sending welcome email
 * - Logging registration activity
 * - Initializing user profile
 */
public class UserRegisteredEvent extends ApplicationEvent {

    private final User user;

    public UserRegisteredEvent(Object source, User user) {
        super(source);
        this.user = user;
    }

    public User getUser() {
        return user;
    }
}
