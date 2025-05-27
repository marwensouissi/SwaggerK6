package org.example.k6backend.Services;

import org.example.k6backend.Entities.User;
import org.example.k6backend.Entities.Scenario;
import org.example.k6backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        return userRepository.save(user);
    }


    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() &&
                !(authentication instanceof AnonymousAuthenticationToken)) {

            Object principal = authentication.getPrincipal();
            String username = (principal instanceof UserDetails)
                    ? ((UserDetails) principal).getUsername()
                    : principal.toString();

            return userRepository.findByUsername(username);
        }
        throw new AccessDeniedException("No authenticated user found.");
    }


    public List<Scenario> getCurrentUserScenarios() {
        User user = getCurrentUser();
        return user.getScenarios(); // lazy-loaded list
    }

}


