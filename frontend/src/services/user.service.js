import axios from "axios";
import authHeader from "./auth-header";
import AuthService from "./auth.service";

const currentUser = AuthService.getCurrentUser();
const id = currentUser ? currentUser.id : "";

const API_URL = "http://localhost:8080/test/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getAllUsers = () => {
  return axios.get(API_URL + "findAllUsers");
};
const getUserById = (profileId) => {
  return axios.get(API_URL + `findProfileDataById/${profileId}`);
};
const findMyFollowers = (id) => {
  return axios.post(API_URL + `findMyFollowers`, {
    id,
  });
};

const editProfile = (image_url) => {
  const data = new FormData();
  data.append("_method", "put");
  // data.append("email", email);
  data.append("file", image_url);
  return axios.post(API_URL + `updateProfile/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const UserService = {
  getPublicContent,
  getAllUsers,
  getUserById,
  findMyFollowers,
  editProfile,
};

export default UserService;
