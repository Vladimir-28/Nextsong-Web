package utez.edu.mx.nextsong.services;

import lombok.RequiredArgsConstructor;import org.springframework.stereotype.Service;
import utez.edu.mx.nextsong.models.User;
import utez.edu.mx.nextsong.repositories.UserRepository;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getCurrentUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public User updateUser(User updatedUser) {
        if (updatedUser.getId() == null) {
            throw new RuntimeException("El ID del usuario es obligatorio");
        }

        User user = userRepository.findById(updatedUser.getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (updatedUser.getFullName() != null) {
            user.setFullName(updatedUser.getFullName());
        }

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(updatedUser.getPassword());
        }

        return userRepository.save(user);
    }

    // ✅ Nuevo método para buscar colaboradores por email
    public List<User> findByEmailContaining(String email) {
        return userRepository.findByEmailContaining(email);
    }
}