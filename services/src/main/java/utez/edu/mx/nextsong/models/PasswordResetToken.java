package utez.edu.mx.nextsong.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="password_reset_tokens")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    private LocalDateTime expirationDate;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

}