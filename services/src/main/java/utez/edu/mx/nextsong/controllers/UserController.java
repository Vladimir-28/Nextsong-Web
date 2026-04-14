package utez.edu.mx.nextsong.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.nextsong.models.User;
import utez.edu.mx.nextsong.services.UserService;
import java.util.List;
import utez.edu.mx.nextsong.models.UserCategory;
import utez.edu.mx.nextsong.repositories.UserCategoryRepository;

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

    @PutMapping("/update")
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(user));
    }

    // Endpoint para buscar músicos por correo
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String email) {
        return ResponseEntity.ok(userService.findByEmailContaining(email));
    }

    private final UserCategoryRepository categoryRepository;

    @GetMapping("/{userId}/categories")
    public ResponseEntity<List<UserCategory>> getCategories(@PathVariable Long userId) {
        return ResponseEntity.ok(categoryRepository.findByUserId(userId));
    }

    @PostMapping("/{userId}/categories")
    public ResponseEntity<UserCategory> addCategory(@PathVariable Long userId, @RequestBody UserCategory category) {
        User user = userService.getCurrentUser(userId);
        category.setUser(user);
        return ResponseEntity.ok(categoryRepository.save(category));
    }
}