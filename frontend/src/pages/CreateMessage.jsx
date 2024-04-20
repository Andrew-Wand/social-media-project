import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import MessageService from "../services/message.service";

const CreateMessage = () => {
  const queryString = window.location.pathname;
  const userId = queryString.slice(-1);
  const [userSelected, setUserSelected] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const currentUser = AuthService.getCurrentUser();
  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const userList = await UserService.getAllUsers();
        setUserSelected(userList.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserList();
  }, []);

  const messageTextOnChange = (e) => {
    const message = e.target.value;
    setMessageText(message);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    let owner = currentUser.id;

    MessageService.postSendMessage(
      messageText,
      owner,
      receiverId.toString()
    ).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  const filteredUserList = userSelected.filter((user) => user.id == userId);
  const receiverId = filteredUserList.map((user) => {
    return user.id.toString();
  });

  return (
    <div className="min-h-screen">
      <header>
        {filteredUserList.map((user, i) => (
          <h1 className="text-center text-3xl mb-5 mt-5" key={i}>
            Message {user.username}
          </h1>
        ))}
      </header>
      <Link to="/" className="btn btn-info text-lg mb-5 ml-[3.4rem]">
        Back
      </Link>
      <form onSubmit={handleSendMessage}>
        <div className="flex justify-center">
          <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            onChange={messageTextOnChange}
            placeholder="Type message here..."
            className="textarea textarea-bordered textarea-lg w-full max-w-xs bg-white border-black border-2 text-black"
          ></textarea>
        </div>
        <div className="flex justify-center">
          <button className=" btn mt-5 btn-secondary">Send</button>
        </div>
      </form>
    </div>
  );
};

export default CreateMessage;
