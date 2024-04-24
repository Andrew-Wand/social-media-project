import axios from "axios";
import authHeader from "./auth-header";
import AuthService from "./auth.service";

const currentUser = AuthService.getCurrentUser();
const id = currentUser ? currentUser.id : "";

const API_URL = "http://localhost:8080/test/";

const postCreatePost = (Title, Text, userId, owner) => {
  return axios
    .post(API_URL + "create-post", {
      Title,
      Text,
      userId,
      owner,
    })
    .then((response) => {
      return response;
    });
};

const deletePost = (postId) => {
  return axios.delete(API_URL + "delete-post", {
    data: {
      postId,
    },
  });
};

const getMyHomeFeed = (userId) => {
  return axios.get(API_URL + `getMyHomeFeed/${userId}`);
};
const getAllPosts = (userId) => {
  return axios.get(API_URL + `getAllPosts/${userId}`);
};

const getSinglePost = (postId) => {
  return axios.get(API_URL + `post/${postId}`);
};

const createLike = (total, postId, userId) => {
  return axios.post(API_URL + "create-like", {
    total,
    postId,
    userId,
  });
};

const getAllLikes = () => {
  return axios.get(API_URL + "getLikes");
};

// Comments
const postCreateComment = (comment_text, postId, userId, owner) => {
  return axios
    .post(API_URL + "create-comment", {
      comment_text,
      postId,
      userId,
      owner,
    })
    .then((response) => {
      return response.data;
    });
};

const PostService = {
  postCreatePost,
  getMyHomeFeed,
  getSinglePost,
  postCreateComment,
  createLike,
  getAllLikes,
  getAllPosts,
  deletePost,
};

export default PostService;
