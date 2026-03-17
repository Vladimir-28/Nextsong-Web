package utez.edu.mx.nextsong.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import utez.edu.mx.nextsong.models.User;
import utez.edu.mx.nextsong.repositories.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User register(User user) {

        // Validación correcta
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("El correo ya existe");
        }

        return userRepository.save(user);
    }
}
