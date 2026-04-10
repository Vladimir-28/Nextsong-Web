const API_URL = "http://localhost:8080/events";

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
};

const EventsController = {};

// obtener todos los eventos
EventsController.findAll = async () => {
    const response = await fetch(API_URL, {
        method: "GET",
        headers
    });

    return await response.json();
};

// obtener por id
EventsController.findById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers
    });

    return await response.json();
};

// crear evento
EventsController.create = async (event, userId) => {
    const response = await fetch(`${API_URL}/creator/${userId}`, {
        method: "POST",
        headers,
        body: JSON.stringify(event)
    });

    if (!response.ok) {
        throw new Error("Error al crear evento");
    }

    return await response.json();
};

// eliminar evento
EventsController.delete = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers
    });

    if (!response.ok) {
        throw new Error("Error al eliminar el evento");
    }

    return true;
};

// obtener eventos por usuario
EventsController.findByUser = async (userId) => {
    const response = await fetch(`${API_URL}/user/${userId}`, {
        method: "GET",
        headers
    });

    if (!response.ok) {
        throw new Error("Error al obtener eventos");
    }

    return await response.json();
};

//Actualizar evento
EventsController.update = async (id, event) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(event)
    });

    if (!response.ok) {
        throw new Error("Error al actualizar evento");
    }

    return await response.json();
};

//Obtener canciones del evento
EventsController.getSongsByEvent = async (eventId) => {
    const response = await fetch(`${API_URL}/${eventId}/songs`);
    return await response.json();
};

//Agregar colaborador
EventsController.addCollaborator = async (eventId, userId) => {
    const response = await fetch(`${API_URL}/${eventId}/collaborators/${userId}`, {
        method: "POST",
        headers
    });

    if (!response.ok) throw new Error("Error al agregar colaborador");
};

//Quitar colaborador
EventsController.removeCollaborator = async (eventId, userId) => {
    const response = await fetch(`${API_URL}/${eventId}/collaborators/${userId}`, {
        method: "DELETE",
        headers
    });

    if (!response.ok) throw new Error("Error al eliminar colaborador");
};

export default EventsController;