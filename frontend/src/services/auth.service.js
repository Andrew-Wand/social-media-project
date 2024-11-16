import axios from "axios";

const API_URL = "https://nyghrdxtnpowbwajnqmu.supabase.co/rest/v1/auth/";

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return axios
    .post(
      API_URL + "signin",
      {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Z2hyZHh0bnBvd2J3YWpucW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk0Mjg3MDQsImV4cCI6MjAzNTAwNDcwNH0.6h6wCEgvile6QBimGPBqemYkwqDdQNtSfkG8GoOOK-4",
        },
      }
    )
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("SMuser", JSON.stringify(response.data));
        return response.data.id;
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("SMuser");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("SMuser"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
