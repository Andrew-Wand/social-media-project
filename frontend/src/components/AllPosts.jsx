import { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import PostService from "../services/post.service";
import { Link, useNavigate } from "react-router-dom";
import { HiMiniHeart, HiOutlineHeart } from "react-icons/hi2";
import moment from "moment";

const AllPosts = () => {
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
      const allPostList = await PostService.getAllPosts(id);

      setAllPosts(allPostList.data);
      if (userIdParam !== user.id) {
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
          className="bg-transparent text-white xl:mx-5 w-full first:mt-3"
          key={i}
        >
          <div className="flex ml-6 mt-3 text-sm">
            <Link to={`/profile/${post.userId}`} className="link">
              {post.owner}
            </Link>
            <p className="mx-2">•</p>
            <p className="">{`${moment(post.createdAt).format("L")}`}</p>
          </div>

          <div className="text-lg ml-6 my-5">
            <Link
              to={`/post/${post.id}`}
              // onClick={() => fetchPostById(post.id)}
              className="underline mb-5"
            >
              {post.Title}
            </Link>
            <p>{post.Text}</p>
          </div>
          <div className="flex justify-around mr-10 mb-5">
            <p className="btn rounded-3xl">Likes: {post.likes.length}</p>
            <p className="btn rounded-3xl">Comments: {post.comments.length}</p>
            <form key={i} value={i} onSubmit={handleCreateLike}>
              {post.likes.length > 0 ? (
                <button
                  key={i}
                  value={i}
                  onClick={(e) => getIndex(e, i)}
                  className="btn rounded-full"
                >
                  <HiMiniHeart className="pointer-events-none text-2xl" />
                </button>
              ) : (
                <button
                  key={i}
                  value={i}
                  onClick={(e) => getIndex(e, i)}
                  className="btn rounded-full"
                >
                  <HiOutlineHeart className="pointer-events-none text-2xl " />
                </button>
              )}
            </form>
          </div>

          <hr className="border-b-solid border-b-[.0625rem] border-[#242c2e]" />
        </li>
      ))}
    </ul>
  );
};

export default AllPosts;
