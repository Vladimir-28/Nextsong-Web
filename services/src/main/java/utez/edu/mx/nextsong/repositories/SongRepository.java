package utez.edu.mx.nextsong.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import utez.edu.mx.nextsong.models.Song;

import java.util.List;

/**
 * ✅ TU REPOSITORIO ORIGINAL con un método de búsqueda agregado.
 *    El método existsBySong_Id que usas en SongService sigue funcionando igual
 *    (ese está en EventSongRepository, no en este).
 */
public interface SongRepository extends JpaRepository<Song, Long> {

    // ✅ NUEVO: búsqueda por título o autor (case-insensitive)
    // Usado por GET /songs/search?q=...
    @Query("SELECT s FROM Song s WHERE " +
            "LOWER(s.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.author) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Song> findByTitleOrAuthorContaining(@Param("query") String query);
}
