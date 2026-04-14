package utez.edu.mx.nextsong.dto;

public class UserDTO {

    private Long id;
    private String fullName;
    private String email;
    private String status;
    private String role;

    public UserDTO(Long id, String fullName, String email, String status, String role) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.status = status;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getStatus() {
        return status;
    }

    public String getRole() {
        return role;
    }
}