import { buildApiUrl } from "../../../../services/api";

const API_URL = buildApiUrl("/api/user");

const UsersController = {};

UsersController.search = async (email) => {
    const res = await fetch(`${API_URL}/search?email=${email}`);
    return await res.json();
};

export default UsersController;
