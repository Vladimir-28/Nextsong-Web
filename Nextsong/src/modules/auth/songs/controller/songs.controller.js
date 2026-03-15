export default function SongsController () {}

const API_URL = "http://localhost:5173/songs.json";
const headers = {
    ContentType: "application/json",
    Accept: "application/json"
}

SongsController.findAll = async () => await fetch(API_URL, {
    method: 'GET',
    headers: headers
})
.then(response => response.json())
.then(result => result)
.catch(console.log);