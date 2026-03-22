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
        // Nota: Este método aún busca el ID 1. Si quieres que sea dinámico para cada músico,
        // deberías pasar el ID por parámetro o usar el contexto de Spring Security.
        return userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public User updateUser(User updatedUser) {
        // ✅ CORRECCIÓN: Ahora buscamos al usuario por el ID que envía la aplicación móvil
        if (updatedUser.getId() == null) {
            throw new RuntimeException("El ID del usuario es obligatorio para actualizar");
        }

        User user = userRepository.findById(updatedUser.getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + updatedUser.getId()));

        // Actualizamos los campos recibidos
        user.setFullName(updatedUser.getFullName());

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(updatedUser.getPassword());
        }

        // Mantenemos o actualizamos el estatus y el rol si es necesario
        if (updatedUser.getStatus() != null) {
            user.setStatus(updatedUser.getStatus());
        }

        // Guardamos los cambios en la base de datos
        return userRepository.save(user);
    }
}