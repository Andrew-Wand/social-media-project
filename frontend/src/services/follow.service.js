import axios from "axios";

const API_URL = "https://nyghrdxtnpowbwajnqmu.supabase.co/rest/v1/test/";

const createFollower = (name, userId, followerId) => {
  return axios
    .post(API_URL + "createFollower", {
      name,
      userId,
      followerId,
    })
    .then((response) => {
      return response;
    });
};

const FollowService = {
  createFollower,
};

export default FollowService;
