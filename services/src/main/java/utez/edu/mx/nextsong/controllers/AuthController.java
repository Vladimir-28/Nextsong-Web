package utez.edu.mx.nextsong.controllers;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.nextsong.repositories.UserRepository;
import utez.edu.mx.nextsong.models.User;
import utez.edu.mx.nextsong.dto.LoginRequest;

import java.util.Optional;
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest request){

        Optional<User> user = userRepository.findByEmail(request.getEmail());

        if(user.isPresent() && user.get().getPassword().equals(request.getPassword())){
            return user.get();
        }

        throw new RuntimeException("Credenciales incorrectas");
    }
}
