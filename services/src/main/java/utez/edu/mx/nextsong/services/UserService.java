package utez.edu.mx.nextsong.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import utez.edu.mx.nextsong.models.User;
import utez.edu.mx.nextsong.repositories.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        return userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public User updateUser(User updatedUser) {

        User user = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));


        user.setFullName(updatedUser.getFullName());


        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(updatedUser.getPassword());
        }

        return userRepository.save(user);
    }
}