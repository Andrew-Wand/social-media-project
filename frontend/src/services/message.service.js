import axios from "axios";

const API_URL = "http://nyghrdxtnpowbwajnqmu.supabase.co/rest/v1/test/";

const getMessageList = () => {
  return axios.get(API_URL + "allMessageList");
};
const postSendMessage = (text, owner, receiver) => {
  return axios.post(API_URL + "sendmessage", {
    text,
    owner,
    receiver,
  });
};

const MessageService = {
  getMessageList,
  postSendMessage,
};

export default MessageService;
