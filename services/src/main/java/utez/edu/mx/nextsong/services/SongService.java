package utez.edu.mx.nextsong.services;

import org.springframework.stereotype.Service;
import utez.edu.mx.nextsong.models.EventSong;
import utez.edu.mx.nextsong.repositories.EventSongRepository;
import utez.edu.mx.nextsong.repositories.SongRepository;
import utez.edu.mx.nextsong.models.Song;

import java.util.List;

@Service
public class SongService {
    private final SongRepository songRepository;
    private final EventSongRepository eventSongRepository;

    public SongService(SongRepository songRepository, EventSongRepository eventSongRepository){
        this.songRepository = songRepository;
        this.eventSongRepository = eventSongRepository;
    }

    public List<Song> findAll(){
        return songRepository.findAll();
    }

    public Song save(Song song){
        return songRepository.save(song);
    }

    public Song findById(Long id){
        return songRepository.findById(id).orElse(null);
    }

    public boolean deleteById(Long id){
        if(!songRepository.existsById(id)){
            return false;
        }

        // 1. Obtener relaciones antes de borrar
        List<EventSong> relations = eventSongRepository.findAll()
                .stream()
                .filter(es -> es.getSong().getId().equals(id))
                .toList();

        // 2. Obtener IDs de eventos afectados
        List<Long> eventIds = relations.stream()
                .map(es -> es.getEvent().getId())
                .distinct()
                .toList();

        // 3. Eliminar relaciones
        eventSongRepository.deleteBySong_Id(id);

        // 4. Reordenar cada evento
        for(Long eventId : eventIds){

            List<EventSong> songs = eventSongRepository
                    .findByEvent_IdOrderBySongOrder(eventId);

            int order = 1;

            for(EventSong es : songs){
                es.setSongOrder(order++);
            }

            eventSongRepository.saveAll(songs);
        }

        // 5. Eliminar canción
        songRepository.deleteById(id);

        return true;
    }
}
