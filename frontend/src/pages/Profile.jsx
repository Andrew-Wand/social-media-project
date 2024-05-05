import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import PostService from "../services/post.service";
import FollowService from "../services/follow.service";
import { AiOutlineMessage } from "react-icons/ai";
import { HiMiniHeart, HiOutlineHeart } from "react-icons/hi2";
import { FaRegCommentAlt } from "react-icons/fa";
import moment from "moment";

const Profile = () => {
  const [userProfileData, setUserProfileData] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [keyIndex, setKeyIndex] = useState();
  const [isLoading, setIsLoading] = useState(null);
  const [likeCount, setLikeCount] = useState(0);

  const user = AuthService.getCurrentUser();
  const profileIdParams = window.location.pathname.slice(-1);
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location);
  const fetchUserById = async (id) => {
    try {
      const currentUserProfile = await UserService.getUserById(id);
      setUserProfileData(currentUserProfile.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserById(profileIdParams);
  }, [location]);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // console.log(userProfileData);

  const handleFollowSubmit = async (e) => {
    e.preventDefault();

    const user = AuthService.getCurrentUser();
    const userId = user?.id;
    const name = user.username;
    const followerId = Number(profileIdParams);

    FollowService.createFollower(name, userId, followerId).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);

        fetchUserById(response.config.data.slice(-2, -1));
        // setIsLoading(false);
        // fetchAllPosts(response.config.data.slice(-2, -1));
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const userFollowersFiltered = userProfileData.userFollowers?.filter(
    (follower) => follower.id === currentUser.id
  );

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
        fetchUserById(profileIdParams);
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

  const getIndex = (e, index) => {
    setKeyIndex(e.target.value, index);
  };

  const handleNavigatePost = (url) => navigate(url);

  console.log(userProfileData);
  return (
    <div className="bg-base-300 xl:pr-20">
      <div className="min-h-screen xl:mx-[30rem] xl:border-x-2 xl:border-x-neutral-500/50">
        <div className="flex justify-between items-center mx-6 py-8 ">
          <div>
            <h2 className="text-3xl text-center">{userProfileData.username}</h2>
            <span className="text-xs font-light">
              {userProfileData.userFollowers?.length} Followers
            </span>
          </div>

          <div className="flex items-center mt-2">
            <form onSubmit={handleFollowSubmit}>
              {userFollowersFiltered?.map((follower, i) => (
                <div key={i} className="flex">
                  {follower.id === currentUser.id ? (
                    <>
                      <button className="btn bg-gradient-to-r from-[#A7B5FF] to-[#F3ACFF]  text-black">
                        Unfollow
                      </button>
                      <Link
                        to={`/messageDashboard/${currentUser.id}`}
                        className="btn text-2xl rounded-full ml-5  bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] text-black"
                      >
                        <AiOutlineMessage />
                      </Link>
                    </>
                  ) : (
                    ""
                    // <button>Follow</button>
                  )}
                </div>
              ))}

              {/* {currentUser?.id === profileIdParams && ""} */}

              {userFollowersFiltered?.length === 0 ? (
                <button
                  className={
                    currentUser?.id === Number(profileIdParams)
                      ? "hidden"
                      : "btn bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] text-black"
                  }
                >
                  Follow
                </button>
              ) : (
                ""
              )}
            </form>
          </div>
        </div>
        <div className="divider"></div>
        <div className="ml-6 ">
          <p className="text-2xl ">Posts</p>
          <span className="text-xs font-light">
            {userProfileData.posts?.length} Posts
          </span>
        </div>

        <div className="divider"></div>

        <div>
          <ul>
            {userProfileData.posts?.map((post, i) => (
              <>
                <li
                  className="bg-transparent text-white  w-full first:mt-3 xl:hover:bg-base-100 xl:py-2 xl:rounded-xl xl:cursor-pointer"
                  key={i}
                  onClick={() => handleNavigatePost(`/post/${post.id}`)}
                >
                  <div className="flex ml-6 mt-3 text-sm">
                    <Link to={`/profile/${post.userId}`} className="link">
                      {post.owner}
                    </Link>
                    <p className="mx-2">•</p>
                    <p className="">{`${moment(post.createdAt).format(
                      "L"
                    )}`}</p>
                  </div>

                  <div className="text-lg ml-6 my-5">
                    <Link
                      to={`/post/${post.id}`}
                      // onClick={() => fetchPostById(post.id)}
                      className="underline mb-5"
                    >
                      {post.Title}
                    </Link>
                    <p className="break-words">{post.Text}</p>
                  </div>
                  <div className="flex justify-start mr-10 mb-5">
                    <p className="btn rounded-3xl mx-5">
                      <FaRegCommentAlt className="text-lg" />
                      {post.comments?.length}
                    </p>

                    <form key={i} value={i} onSubmit={handleCreateLike}>
                      {post.likeCounts > 0 ? (
                        <button
                          key={i}
                          value={post.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            getIndex(e, i);
                          }}
                          className="btn rounded-full"
                        >
                          <HiMiniHeart className="pointer-events-none text-2xl text-[#de2a43]" />
                          <p className="">{post.likeCounts}</p>
                        </button>
                      ) : (
                        <button
                          key={i}
                          value={post.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            getIndex(e, i);
                          }}
                          className="btn rounded-full"
                        >
                          <HiOutlineHeart className="pointer-events-none text-2xl " />
                          <p className="">{post.likeCounts}</p>
                        </button>
                      )}
                    </form>
                  </div>
                </li>
                <hr className="border-b-solid border-b-[.0625rem] border-[#242c2e] xl:my-2" />
              </>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
