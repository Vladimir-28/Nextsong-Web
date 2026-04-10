package utez.edu.mx.nextsong.controllers;import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.nextsong.dto.UserDTO;
import utez.edu.mx.nextsong.models.Role;
import utez.edu.mx.nextsong.repositories.RoleRepository;
import utez.edu.mx.nextsong.repositories.UserRepository;
import utez.edu.mx.nextsong.models.User;
import utez.edu.mx.nextsong.dto.LoginRequest;
import utez.edu.mx.nextsong.models.PasswordResetToken;
import utez.edu.mx.nextsong.repositories.PasswordResetTokenRepository;
import utez.edu.mx.nextsong.services.EmailService;

import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    public AuthController(UserRepository userRepository,
                          RoleRepository roleRepository,
                          PasswordResetTokenRepository tokenRepository,
                          EmailService emailService){
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        // Usamos la nueva búsqueda insensible a mayúsculas
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if(userOpt.isPresent() && userOpt.get().getPassword().equals(request.getPassword())){
            User user = userOpt.get();

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

    // --- LÓGICA DE RECUPERACIÓN DE CONTRASEÑA ---

    // PASO 1: Enviar código al correo
    @PostMapping("/recover-password")
    @Transactional
    public ResponseEntity<?> requestRecovery(@RequestParam("email") String email) {
        System.out.println("Solicitando recuperación para: [" + email + "]");

        // Búsqueda insensible a mayúsculas y minúsculas con limpieza de espacios
        Optional<User> user = userRepository.findByEmail(email.trim());

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El correo es obligatorio");
        }

        if (user.isEmpty()) {
            System.out.println("DEBUG: El correo no existe en la BD.");
            return ResponseEntity.status(404).body("El correo no está registrado");
        }

        // Generar código aleatorio de 6 dígitos
        String code = String.format("%06d", new Random().nextInt(999999));

        // Limpiar códigos anteriores y guardar el nuevo
        tokenRepository.deleteByEmail(email);
        tokenRepository.save(new PasswordResetToken(email, code, 15));

        // Enviar el correo
        emailService.sendRecoveryCode(email, code);

        return ResponseEntity.ok().build();
    }

    // PASO 2: Verificar que el código sea correcto
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestParam String email, @RequestParam String code) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByEmail(email);

        if (tokenOpt.isPresent() &&
                tokenOpt.get().getCode().equals(code) &&
                !tokenOpt.get().isExpired()) {
            return ResponseEntity.ok().build();
        }

        if (email == null || email.isBlank() || code == null || code.isBlank()) {
            return ResponseEntity.badRequest().body("Datos incompletos");
        }

        return ResponseEntity.status(401).body("Código incorrecto o expirado");
    }

    // PASO 3: Establecer la nueva contraseña final
    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<?> resetPassword(@RequestParam String email, @RequestParam String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }

        if (email == null || email.isBlank() || newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body("Datos incompletos");
        }


        User user = userOpt.get();
        user.setPassword(newPassword);
        userRepository.save(user);

        // Eliminar el token usado
        tokenRepository.deleteByEmail(email);

        return ResponseEntity.ok().build();
    }
}