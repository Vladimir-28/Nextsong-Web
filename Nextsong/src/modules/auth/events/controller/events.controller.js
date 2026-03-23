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

export default EventsController;