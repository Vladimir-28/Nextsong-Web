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
EventsController.create = async (event) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(event)
    });

    return await response.json();
};

export default EventsController;