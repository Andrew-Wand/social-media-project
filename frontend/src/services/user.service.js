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

const editProfile = (username) => {
  return axios.put(API_URL + `updateProfile/${id}`, {
    username,
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
