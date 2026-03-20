package utez.edu.mx.nextsong.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import utez.edu.mx.nextsong.models.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
}