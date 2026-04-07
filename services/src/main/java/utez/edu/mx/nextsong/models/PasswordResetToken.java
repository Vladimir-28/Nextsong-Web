package utez.edu.mx.nextsong.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity@Table(name = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "token_seq_gen")
    @SequenceGenerator(name = "token_seq_gen", sequenceName = "PASSWORD_TOKENS_SEQ", allocationSize = 1)
    private Long id;

    private String email;
    private String code;
    private LocalDateTime expiryDate;

    public PasswordResetToken() {}

    public PasswordResetToken(String email, String code, int minutes) {
        this.email = email;
        this.code = code;
        this.expiryDate = LocalDateTime.now().plusMinutes(minutes);
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }
}
