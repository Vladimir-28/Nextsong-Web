package utez.edu.mx.nextsong.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import utez.edu.mx.nextsong.models.EventSong;

import java.util.List;

public interface EventSongRepository extends JpaRepository<EventSong, Long> {

    List<EventSong> findByEventIdOrderBySongOrder(Long eventId);
    int countByEventId(Long eventId);

    void deleteByEventId(Long eventId);
}