package utez.edu.mx.nextsong.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import utez.edu.mx.nextsong.models.User;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    // ✅ NUEVO: Buscar usuarios que contengan este email
    List<User> findByEmailContainingIgnoreCase(String email);
}