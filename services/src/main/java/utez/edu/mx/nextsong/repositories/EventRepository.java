package utez.edu.mx.nextsong.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import utez.edu.mx.nextsong.models.Event;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // Busca eventos creados por un usuario específico
    List<Event> findByCreatorId(Long creatorId);
}