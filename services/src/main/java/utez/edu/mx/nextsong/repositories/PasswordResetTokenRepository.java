package utez.edu.mx.nextsong.repositories;

import org.springframework.data.jpa.repository.JpaRepository;import utez.edu.mx.nextsong.models.PasswordResetToken;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByEmail(String email);
    void deleteByEmail(String email);
}