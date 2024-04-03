import axios from "axios";
import authHeader from "./auth-header";
import AuthService from "./auth.service";

const currentUser = AuthService.getCurrentUser();
const id = currentUser ? currentUser.id : "";

const API_URL = "http://localhost:8080/test/";

const postCreatePost = (Title, Text, userId, owner) => {
  return axios.post(API_URL + "create-post", {
    Title,
    Text,
    userId,
    owner,
  });
};

const getAllPosts = () => {
  return axios.get(API_URL + "getAllPosts");
};

const PostService = {
  postCreatePost,
  getAllPosts,
};

export default PostService;
