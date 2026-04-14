package utez.edu.mx.nextsong.dto;

public class EventSongDTO {

    private Long songId;
    private Integer songOrder;

    public EventSongDTO() {
    }

    public Long getSongId() {
        return songId;
    }

    public void setSongId(Long songId) {
        this.songId = songId;
    }

    public Integer getSongOrder() {
        return songOrder;
    }

    public void setSongOrder(Integer songOrder) {
        this.songOrder = songOrder;
    }
}