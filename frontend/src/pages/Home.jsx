import { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import PostService from "../services/post.service";
import { Link, useNavigate } from "react-router-dom";
import { HiMiniHeart, HiOutlineHeart } from "react-icons/hi2";
import UserFeed from "../components/UserFeed";
import AllPosts from "../components/AllPosts";

const Home = ({ loggedIn }) => {
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
  const [homeFeed, setHomeFeed] = useState("myFeed");

  let auth = { token: true };
  console.log(auth);
  // console.log(auth);
  const userIdParam = window.location.pathname.slice(-1);
  const navigate = useNavigate();
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const user = AuthService.getCurrentUser();
  // console.log(currentUser);
  const fetchAllPosts = async (id) => {
    try {
      const allPostList = await PostService.getMyHomeFeed(id);

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

  // const fetchPostById = async (id) => {
  //   try {
  //     const postById = await PostService.getSinglePost(id);
  //     setSinglePost(postById.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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

  // const getMyFeed = () => {
  //     setHomeFeed('myFeed')
  // }

  // const getAllPosts = () => {

  // }

  // console.log(compareTwoArrayOfObjects(usernameId, postUserId));

  return (
    <div className=" xl:mx-[27rem]">
      {currentUser ? (
        // HOME PAGE if user is logged in

        <div className="min-h-screen pb-5">
          <div className="px-5 ">
            <h1 className="mt-5 ml-2 text-3xl text-white">
              {currentUser?.username}'s Feed
            </h1>
            <div className="divider"></div>

            <div className="flex justify-between">
              <div className="">
                <div
                  role="tablist"
                  className="tabs tabs-boxed [--rounded-btn:3px] "
                >
                  <a
                    role="tab"
                    className={
                      homeFeed === "myFeed"
                        ? "tab bg-[#666666] text-[1rem] text-white "
                        : "tab text-[1rem]"
                    }
                    onClick={() => setHomeFeed("myFeed")}
                  >
                    My Feed
                  </a>
                  <a
                    role="tab"
                    className={
                      homeFeed === "allPosts"
                        ? "tab bg-[#666666] text-[1rem] text-white "
                        : "tab text-[1rem] "
                    }
                    onClick={() => setHomeFeed("allPosts")}
                  >
                    All Posts
                  </a>
                </div>
              </div>

              <div className="mt-2">
                <Link
                  to="/create-post"
                  className="bg-[#fff] p-2 rounded-xl shadow-lg text-black  "
                >
                  <span>+ </span>
                  Create Post
                </Link>
              </div>
            </div>

            {/* <div className="flex justify-evenly mt-10">
              <button
                className={homeFeed === "myFeed" ? "btn" : "btn btn-outline"}
                onClick={() => setHomeFeed("myFeed")}
              >
                My Feed
              </button>
              <button
                className={homeFeed === "allPosts" ? "btn" : "btn btn-outline"}
                onClick={() => setHomeFeed("allPosts")}
              >
                All
              </button>
            </div> */}
          </div>
          <div className="">
            {homeFeed === "myFeed" ? <UserFeed /> : <AllPosts />}

            {/* <ul>
              {allPosts?.map((post, i) => (
                <li
                  className="bg-slate-500 text-black my-10 p-10 m-5 rounded-lg shadow-lg"
                  key={i}
                >
                  <Link
                    to={`/post/${post.id}`}
                    onClick={() => fetchPostById(post.id)}
                    className="underline mb-5"
                  >
                    {post.Title}
                  </Link>
                  <p>{post.Text}</p>

                  <p>Likes: {post.likes.length}</p>
                  <p>Comments: {post.comments.length}</p>

                  <form key={i} value={i} onSubmit={handleCreateLike}>
                    <button
                      className={post.likes.length === 0 ? "btn" : "btn-lg"}
                    >
                      Like
                    </button>
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

                    {post.likes?.map((like) => (
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
                    ))}
                  </form>

                  <p>
                    Posted By:
                    <Link to={`/profile/${post.userId}`} className="btn">
                      {post.owner}
                    </Link>
                  </p>
                </li>
              ))}
            </ul> */}
          </div>
        </div>
      ) : (
        // HOME PAGE if user is logged out
        <div className="container xl:min-w-full h-screen bg-slate-400 flex justify-center items-center">
          <div className="card w-96 bg-base-100 shadow-xl h-[25rem]">
            <header className="mt-20">
              <h1 className="card-title justify-center text-2xl">
                Welcome to Chat Room!
              </h1>
            </header>

            <div className="card-body items-center justify-center text-center">
              <div className="card-actions">
                <div>
                  <ul>
                    <li className="">
                      <Link to={"/sign-in"} className="btn btn-wide btn-info">
                        Login
                      </Link>
                    </li>
                    <div className="divider">or</div>
                    <li className="">
                      <Link
                        to={"/register"}
                        className="btn btn-wide btn-neutral"
                      >
                        Sign Up
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
