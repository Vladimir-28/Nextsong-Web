const API_URL = "http://localhost:5173/events.json";

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
};

const EventsController = {};

// obtener todos los eventos
EventsController.findAll = async () => {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: headers
    });

    return await response.json();
};

// obtener un evento por id
EventsController.findById = async (id) => {

    const events = await EventsController.findAll();

    return events.find(e => e.id === parseInt(id));
};

export default EventsController;