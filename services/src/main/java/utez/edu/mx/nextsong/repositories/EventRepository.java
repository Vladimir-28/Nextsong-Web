package utez.edu.mx.nextsong.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import utez.edu.mx.nextsong.models.Event;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Usamos @Query para buscar por el ID del objeto creator
    @Query("SELECT e FROM Event e WHERE e.creator.id = :creatorId")
    List<Event> findByCreatorId(@Param("creatorId") Long creatorId);

    // Usamos @Query para buscar en la lista de colaboradores
    @Query("SELECT e FROM Event e JOIN e.collaborators c WHERE c.id = :userId")
    List<Event> findByCollaboratorsId(@Param("userId") Long userId);
}