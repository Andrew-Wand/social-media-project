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

const UserService = {
  getPublicContent,
  getAllUsers,
};

export default UserService;
