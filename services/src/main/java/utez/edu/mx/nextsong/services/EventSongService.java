package utez.edu.mx.nextsong.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 🔥 Importante
import utez.edu.mx.nextsong.models.Event;
import utez.edu.mx.nextsong.models.EventSong;
import utez.edu.mx.nextsong.models.Song;
import utez.edu.mx.nextsong.repositories.EventRepository;
import utez.edu.mx.nextsong.repositories.EventSongRepository;
import utez.edu.mx.nextsong.repositories.SongRepository;
import utez.edu.mx.nextsong.dto.EventSongDTO;

import java.util.List;

@Service
public class EventSongService {

    private final EventSongRepository eventSongRepository;
    private final EventRepository eventRepository;
    private final SongRepository songRepository;

    public EventSongService(EventSongRepository eventSongRepository,
                            EventRepository eventRepository,
                            SongRepository songRepository) {
        this.eventSongRepository = eventSongRepository;
        this.eventRepository = eventRepository;
        this.songRepository = songRepository;
    }

    public List<EventSong> getSongsByEvent(Long eventId){
        return eventSongRepository.findByEventIdOrderBySongOrder(eventId);
    }

    @Transactional // 🔥 Asegura que si algo falla, no se borre nada
    public void saveEventSongs(Long eventId, List<EventSongDTO> songs){

        // 1. Buscamos el evento
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        // 2. 🔥 LIMPIEZA: Borramos las canciones actuales del evento antes de guardar las nuevas
        // Esto evita duplicados y permite "eliminar" al desmarcar en Android
        eventSongRepository.deleteByEvent_Id(eventId);

        // 3. GUARDADO: Insertamos la nueva lista recibida
        int order = 1;
        for (EventSongDTO dto : songs){
            Song song = songRepository.findById(dto.getSongId())
                    .orElseThrow(() -> new RuntimeException("Canción no encontrada"));

            EventSong es = new EventSong();
            es.setEvent(event);
            es.setSong(song);
            // Asignamos el orden secuencialmente
            es.setSongOrder(order++);

            eventSongRepository.save(es);
        }
    }

    @Transactional
    public void deleteByEvent(Long eventId) {
        eventSongRepository.deleteByEvent_Id(eventId);
    }
}