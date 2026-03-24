package utez.edu.mx.nextsong.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.nextsong.models.EventSong;

import java.util.List;

public interface EventSongRepository extends JpaRepository<EventSong, Long> {

    List<EventSong> findByEventIdOrderBySongOrder(Long eventId);

    int countByEventId(Long eventId);

    @Modifying
    @Transactional
    void deleteByEvent_Id(Long eventId);

    @Modifying
    @Transactional
    void deleteBySong_Id(Long songId);

    List<EventSong> findByEvent_IdOrderBySongOrder(Long eventId);
}