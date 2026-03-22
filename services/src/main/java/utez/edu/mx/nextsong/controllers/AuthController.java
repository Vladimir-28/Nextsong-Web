package utez.edu.mx.nextsong.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.nextsong.dto.UserDTO;
import utez.edu.mx.nextsong.models.Role;
import utez.edu.mx.nextsong.repositories.RoleRepository;
import utez.edu.mx.nextsong.repositories.UserRepository;
import utez.edu.mx.nextsong.models.User;
import utez.edu.mx.nextsong.dto.LoginRequest;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public AuthController(UserRepository userRepository, RoleRepository roleRepository){
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if(userOpt.isPresent() && userOpt.get().getPassword().equals(request.getPassword())){

            User user = userOpt.get();

            // 🔴 VALIDACIÓN AGREGADA
            String roleName;
            if (user.getRole() != null) {
                roleName = user.getRole().getName();
            } else {
                return ResponseEntity.status(500).body("El usuario no tiene rol asignado");
            }

            UserDTO dto = new UserDTO(
                    user.getId(),
                    user.getFullName(),
                    user.getEmail(),
                    user.getStatus(),
                    roleName
            );

            return ResponseEntity.ok(dto);
        }

        return ResponseEntity.status(401).body("Credenciales incorrectas");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user){

        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if(existingUser.isPresent()){
            return ResponseEntity.badRequest().body("El correo ya está registrado");
        }

        Role userRole = roleRepository.findById(2L)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        user.setRole(userRole);
        user.setStatus("ACTIVE");

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }
}