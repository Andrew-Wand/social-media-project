import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PostService from "../services/post.service";
import AuthService from "../services/auth.service";

const CreatePost = () => {
  const queryString = window.location.pathname;
  const userId = queryString.slice(-1);
  const [userSelected, setUserSelected] = useState([]);
  const [postText, setPostText] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // const currentUser = AuthService.getCurrentUser();
  // useEffect(() => {
  //   const fetchUserList = async () => {
  //     try {
  //       const userList = await UserService.getUserList();
  //       setUserSelected(userList.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchUserList();
  // }, []);

  const postTitleOnChange = (e) => {
    const title = e.target.value;
    setPostTitle(title);
  };

  const postTextOnChange = (e) => {
    const post = e.target.value;
    setPostText(post);
  };

  const currentUser = AuthService.getCurrentUser();
  const username = currentUser.username;
  const id = currentUser.id;

  const handleCreatePost = (e) => {
    e.preventDefault();
    //   let owner = currentUser.id;

    PostService.postCreatePost(postTitle, postText, id, username).then(
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

  // const filteredUserList = userSelected.filter((user) => user.id == userId);
  // const receiverId = filteredUserList.map((user) => {
  //   return user.id.toString();
  // });

  return (
    <div className="min-h-screen">
      {/* <header>
          {filteredUserList.map((user, i) => (
            <h1 className="text-center text-3xl mb-5 mt-5" key={i}>
              Message {user.username}
            </h1>
          ))}
        </header> */}
      <Link to="/" className="btn btn-info text-lg mb-5 ml-[3.4rem]">
        Back
      </Link>
      <form onSubmit={handleCreatePost}>
        <div>
          <input type="text" onChange={postTitleOnChange} />
        </div>
        <div className="flex justify-center">
          <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            onChange={postTextOnChange}
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

export default CreatePost;
