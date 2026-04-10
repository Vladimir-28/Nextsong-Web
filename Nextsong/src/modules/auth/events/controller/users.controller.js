const API_URL = "http://localhost:8080/api/user";

const UsersController = {};

UsersController.search = async (email) => {
    const res = await fetch(`${API_URL}/search?email=${email}`);
    return await res.json();
};

export default UsersController;