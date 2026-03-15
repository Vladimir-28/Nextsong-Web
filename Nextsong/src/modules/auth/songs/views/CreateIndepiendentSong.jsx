import { useState } from "react";
import { BsChevronRight } from "react-icons/bs";


export default function CreateIndepiendentSong({ show, onClose }) {
  const [title,setTitle] =  useState("")
const [artist,setArtist] = useState("")
const [duration,setDuration] = useState("")
const [bpm,setBpm] = useState("")
const [keyTone,setKeyTone] = useState("")

const createSong = async () => {

    const response = await fetch("http://localhost:8080/songs",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            title:title,
            author:artist,
            duration:duration,
            bpm:bpm,
            keyTone:keyTone,
            status:"ACTIVE"
        })
    })

    if(response.ok){

        alert("Canción creada")

        setTitle("")
        setArtist("")
        setDuration("")
        setBpm("")
        setKeyTone("")
        onClose()   // ← cerrar modal

    }else{
        alert("Error al crear canción")
    }

}

  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">

            {/* Header */}
            <div className="modal-header">
              <div>
                <h5 className="fw-bold mb-0">Crear Canción Independiente</h5>
              </div>

              <button className="btn-close" onClick={onClose}></button>
            </div>

            {/* Body */}
            <div className="modal-body">

              <div
                className="p-4 rounded"
                style={{
                  backgroundColor: "#d7c8bd",
                  border: "1px solid #b89e8c"
                }}
              >

                <h6 className="fw-bold mb-3">
                  Crear nueva canción
                </h6>

                <div className="row g-3">

                  <div className="col-md-6">
                    <label className="form-label">Título *</label>
                    <input
                      className="form-control"
                      placeholder="Nombre de la canción"
                      value={title}
                      onChange={(e)=>setTitle(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Artista *</label>
                    <input
                      className="form-control"
                      placeholder="Nombre del artista"
                      value={artist}
                     onChange={(e)=>setArtist(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Duración *</label>
                    <input className="form-control"
                     placeholder="3:30" 
                    value={duration}
                     onChange={(e)=>setDuration(e.target.value)}/>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Tempo (BPM) *</label>
                    <input 
                    className="form-control" 
                    placeholder="120" 
                    value={bpm}
                     onChange={(e)=>setBpm(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Tonalidad *</label>
                    <input className="form-control"
                    value={keyTone}
                     onChange={(e)=>setKeyTone(e.target.value)}
                     />
                  </div>

                </div>

                

              </div>

            </div>

            {/* Footer */}
            <div className="modal-footer d-flex justify-content-between">

           <button
                className="btn btn-light"
           >
              Volver
            </button>

            <button
               className="btn text-white"
               onClick={createSong}
                style={{ backgroundColor: "#cbb2a1" }}
            >
             Agregar<BsChevronRight className="me-1"/>
            </button>

</div>

          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}