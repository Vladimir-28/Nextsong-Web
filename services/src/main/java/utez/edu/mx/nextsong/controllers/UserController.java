package utez.edu.mx.nextsong.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.nextsong.models.User;
import utez.edu.mx.nextsong.services.UserService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin("*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me/{id}")
    public ResponseEntity<User> getCurrentUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getCurrentUser(id));
    }

    // ✅ Actualizar usuario
    @PutMapping("/update")
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(user));
    }
}