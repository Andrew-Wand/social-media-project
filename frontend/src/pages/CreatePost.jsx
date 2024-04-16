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
  const [likes, setLikes] = useState(0);

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
        if (response) {
          navigate(`/main/${response.data.userId}`);
        }
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
      <div className="flex justify-between mx-5 mt-5 mb-2">
        <Link to={`/main/${id}`} className="">
          <button className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </Link>
        <button className=" btn btn-default rounded-full">Send</button>
      </div>
      <div className="divider p-2 m-0  "></div>
      <div className="flex flex-col items-start w-[26.2rem] ml-1 ">
        <form onSubmit={handleCreatePost} className="w-full">
          <div className="">
            <input
              type="text "
              placeholder="Add title here"
              onChange={postTitleOnChange}
              className="w-full p-2 outline-none bg-transparent"
            />
          </div>
          <div className="divider m-0 p-3"></div>
          <div className="">
            <textarea
              name=""
              id=""
              cols="30"
              rows="10"
              onChange={postTextOnChange}
              placeholder="Type message here..."
              className=" w-full p-2  text-white outline-none bg-transparent"
            ></textarea>
          </div>
          <div className="divider"></div>
          {/* <div className="flex justify-center">
            <button className=" btn mt-5 btn-secondary">Send</button>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
