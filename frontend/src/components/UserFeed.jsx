import { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import PostService from "../services/post.service";
import { Link, useNavigate } from "react-router-dom";
import { HiMiniHeart, HiOutlineHeart } from "react-icons/hi2";

const UserFeed = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [allPosts, setAllPosts] = useState();
  const [allUsers, setAllUsers] = useState([]);
  const [allLikes, setAllLikes] = useState();
  const [singlePost, setSinglePost] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [totalLikes, setTotalLikes] = useState();
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [keyIndex, setKeyIndex] = useState();
  const [isLoading, setIsLoading] = useState(null);

  const navigate = useNavigate();
  const userIdParam = window.location.pathname.slice(-1);
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // console.log(currentUser);
  const fetchAllPosts = async (id) => {
    try {
      const allPostList = await PostService.getMyHomeFeed(id);

      setAllPosts(allPostList.data);
      if (
        userIdParam !== user.id &&
        window.location.pathname === "http://localhost:5173"
      ) {
        navigate(`/main/${user.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // const fetchAllLikes = async () => {
    //   try {
    //     const allLikesList = await PostService.getAllLikes();
    //     setAllLikes(allLikesList.data);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // fetchAllLikes();
    fetchAllPosts(userIdParam);
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const allUserList = await UserService.getAllUsers();
        setAllUsers(allUserList.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllUsers();
  }, []);

  const handleCreateLike = async (e) => {
    e.preventDefault();

    const user = AuthService.getCurrentUser();
    // setKeyIndex(e.target.getAttribute("key"));
    // console.log(e.target.entry, index);
    const userId = user.id;
    let fart = Number(keyIndex) + 1;
    const like = likeCount + 1;
    setIsLoading(true);

    PostService.createLike(like, fart, userId).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        setIsLoading(false);
        fetchAllPosts(response.config.data.slice(-2, -1));
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
        setIsLoading(false);
      }
    );
  };

  // const getKey = (index) => {
  //   let id = index;
  //   setKeyIndex(id);
  // };

  const getIndex = (e, index) => {
    setKeyIndex(e.target.value, index);
  };

  // console.log(compareTwoArrayOfObjects(usernameId, postUserId));

  return (
    <ul>
      {allPosts?.map((post, i) => (
        <li
          className="bg-slate-500 text-black my-5  p-10 mx-5 rounded-lg shadow-lg first:mt-3"
          key={i}
        >
          <Link
            to={`/post/${post.id}`}
            // onClick={() => fetchPostById(post.id)}
            className="underline mb-5"
          >
            {post.Title}
          </Link>
          <p>{post.Text}</p>

          <p>Likes: {post.likes.length}</p>
          <p>Comments: {post.comments.length}</p>

          <form key={i} value={i} onSubmit={handleCreateLike}>
            {/* <button
          className={post.likes.length === 0 ? "btn" : "btn-lg"}
        >
          Like
        </button> */}
            {post.likes.length > 0 ? (
              <button
                key={i}
                value={i}
                onClick={(e) => getIndex(e, i)}
                className=""
              >
                <HiMiniHeart className="pointer-events-none text-2xl" />
              </button>
            ) : (
              <button
                key={i}
                value={i}
                onClick={(e) => getIndex(e, i)}
                className=" "
              >
                <HiOutlineHeart className="pointer-events-none text-2xl " />
              </button>
            )}

            {/* {post.likes?.map((like) => (
          <div>
            <button
              className="btn"
              onClick={() => console.log(post.likes)}
            >
              length
            </button>
            {post.likes?.length ? "yes" : "no"}
            <button
              key={post.id}
              value={post.id}
              onClick={() => setKeyIndex(post.id)}
              className="btn"
            >
              Like
            </button>
          </div>
        ))} */}
          </form>

          <p>
            Posted By:
            <Link to={`/profile/${post.userId}`} className="btn">
              {post.owner}
            </Link>
          </p>
        </li>
      ))}
    </ul>
  );
};

export default UserFeed;
