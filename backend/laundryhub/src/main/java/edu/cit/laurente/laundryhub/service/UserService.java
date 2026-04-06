package edu.cit.laurente.laundryhub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import edu.cit.laurente.laundryhub.entity.User;
import edu.cit.laurente.laundryhub.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public @NonNull User save(@NonNull User user) {
        return userRepository.save(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public @NonNull User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
