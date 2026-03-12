export default function  Header() {

    return (
        <div className="w-100 bg-white border-bottom py-3">
            <div className="d-flex justify-content-center align-items-center gap-3">
                <div
                    className="d-flex justify-content-center align-items-center">
                    <i
                        className="bi bi-apple-music"
                        style={{ color: "#C58A5C", fontSize: "40px" }}
                    ></i>
                </div>
                <h3 className="fw-bold mb-0">NextSong</h3>
            </div>
        </div>
    );
}