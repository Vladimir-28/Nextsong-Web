export default function EventsController () {}

const API_URL = "http://localhost:5173/events.json";
const headers = {
    ContentType: "application/json",
    Accept: "application/json"
}

EventsController.findAll = async () => await fetch(API_URL, {
    method: 'GET',
    headers: headers
})
.then(response => response.json())
.then(result => result)
.catch(console.log);