import { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import PostService from "../services/post.service";
import { Link, useNavigate } from "react-router-dom";
import { HiMiniHeart, HiOutlineHeart } from "react-icons/hi2";
import { HiOutlineTrash } from "react-icons/hi";
import { FaRegCommentAlt } from "react-icons/fa";
import moment from "moment";

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
  const [postClick, setPostClick] = useState();

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
        userIdParam !== user.id ||
        window.location.pathname === "http://localhost:5173"
      ) {
        navigate(`/main/${user.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   const fetchAllLikes = async () => {
  //     try {
  //       const allLikesList = await PostService.getAllLikes();
  //       setAllLikes(allLikesList.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchAllLikes();
  // });

  useEffect(() => {
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

    // setKeyIndex(e.target.getAttribute("key"));
    // console.log(e.target.entry, index);
    const userId = user.id;
    const fart = Number(keyIndex);
    const like = likeCount + 1;
    setIsLoading(true);
    // console.log(fart);

    PostService.createLike(like, fart, userId).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        setIsLoading(false);
        // console.log(response.config.data.slice(-2, -1));
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

  const handleDeletePost = async (e) => {
    e.preventDefault();
    const postId = Number(postClick);

    if (window.confirm("Are you sure you want to delete this post?")) {
      PostService.deletePost(postId).then(
        (response) => {
          setMessage(response.data.message);
          setSuccessful(true);
          setIsLoading(false);
          // console.log(response.config.data.slice(-2, -1));
          fetchAllPosts(userIdParam);
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
    }
  };

  // const getKey = (index) => {
  //   let id = index;
  //   setKeyIndex(id);
  // };

  const getIndex = (e, index) => {
    setKeyIndex(e.target.value, index);
  };

  // console.log(allPosts);
  // console.log(postClick);

  // console.log(compareTwoArrayOfObjects(usernameId, postUserId));

  return (
    <ul>
      {allPosts?.map((post, i) => (
        <>
          <li
            className="bg-transparent text-white  w-full first:mt-3 xl:hover:bg-base-100 xl:py-2 xl:rounded-xl xl:cursor-pointer"
            key={i}
          >
            <div className="flex ml-6 mt-3 text-sm">
              <Link to={`/profile/${post.userId}`} className="link">
                {post.owner}
              </Link>
              <p className="mx-2">•</p>
              <p className="">{`${moment(post.createdAt).format("L")}`}</p>
            </div>

            <div className="text-lg ml-6 my-5 p-1">
              <Link
                to={`/post/${post.id}`}
                // onClick={() => fetchPostById(post.id)}
                className="underline mb-5"
              >
                {post.Title}
              </Link>
              <p className="break-words pr-5">{post.Text}</p>
            </div>
            <div className="flex justify-start mr-10 mb-5">
              <p className="btn rounded-3xl mx-5">
                <FaRegCommentAlt className="text-lg" />
                {post.comments.length}
              </p>
              <form key={i} value={i} onSubmit={handleCreateLike}>
                {post.likes.length > 0 ? (
                  <button
                    key={i}
                    value={post.id}
                    onClick={(e) => getIndex(e, i)}
                    className="btn rounded-full"
                  >
                    <HiMiniHeart className="pointer-events-none text-2xl" />
                    <p className="">{post.likes.length}</p>
                  </button>
                ) : (
                  <button
                    key={i}
                    value={post.id}
                    onClick={(e) => getIndex(e, i)}
                    className="btn rounded-full"
                  >
                    <HiOutlineHeart className="pointer-events-none text-2xl " />
                    <p className="">{post.likes.length}</p>
                  </button>
                )}
              </form>
              {post.userId === user.id ? (
                <div className="ml-10">
                  <form onSubmit={handleDeletePost}>
                    <button
                      className="btn rounded-full"
                      value={post.id}
                      onClick={(e, index) =>
                        setPostClick(e.target.value, index)
                      }
                    >
                      <HiOutlineTrash className="text-2xl" />
                    </button>
                  </form>
                </div>
              ) : (
                ""
              )}
            </div>
          </li>
          <hr className="border-b-solid border-b-[.0625rem] border-[#242c2e] xl:my-2" />
        </>
      ))}
    </ul>
  );
};

export default UserFeed;
