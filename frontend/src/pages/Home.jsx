import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import PostService from "../services/post.service";
import { HiMiniHeart, HiOutlineHeart } from "react-icons/hi2";
import UserFeed from "../components/UserFeed";
import AllPosts from "../components/AllPosts";
import Pic from "../assets/undraw_blog_post_re_fy5x.svg";
import SignInModal from "../components/SignInModal";
import RegisterModal from "../components/RegisterModal";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

const required = (value) => {
  if (!value) {
    return (
      <div className="label">
        <span className="label-text text-[#bd5664]">
          Please fill out this field
        </span>
      </div>
    );
  }
};

const Home = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [allUsers, setAllUsers] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [keyIndex, setKeyIndex] = useState();
  const [isLoading, setIsLoading] = useState(null);
  const [homeFeed, setHomeFeed] = useState("myFeed");

  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useRef();
  const guestUsername = import.meta.env.VITE_GUEST_USERNAME;
  const guestPassword = import.meta.env.VITE_GUEST_PASSWORD;
  const navigate = useNavigate();
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    setUsername(guestUsername);
    setPassword(guestPassword);
  }, []);

  const user = AuthService.getCurrentUser();

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

  const handleGuestLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.login(username, password).then(
        (response) => {
          setMessage(response.data);

          setSuccessful(true);
          if (response) {
            setLoading(true);

            navigate(`/main/${response}`);
            window.location.reload();
          }
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setLoading(false);
          setMessage(resMessage);
        }
      );
    } else {
      setLoading(false);
    }
  };

  // Follow list stuff
  const [myFollowers, setMyFollowers] = useState([]);
  const fetchMyFollowers = async (id) => {
    try {
      const myFollowList = await UserService.findMyFollowers(id);
      setMyFollowers(myFollowList.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyFollowers(user.id);
    }
  }, []);

  console.log(myFollowers);

  return (
    <div className="  bg-base-300 min-h-screen xl:min-h-screen  xl:w-full  ">
      {user ? (
        // HOME PAGE if user is logged in

        <div className="min-h-screen pb-5 xl:mx-[32rem] xl:border-x-2 xl:border-x-neutral-500/50">
          <div className="hidden xl:block absolute left-[6.5rem] bg-black/25 w-[334px] h-[364px] mt-14 rounded-md overflow-auto ">
            <div>
              <p className="text-xl font-bold p-5 border-b-[1px] border-neutral-500/50">
                Follow List
              </p>
            </div>
            <div className="mt-2 ">
              {myFollowers?.map((user) => (
                <div className="flex justify-between mb-2 px-3 py-2 items-center hover:bg-base-300 rounded-md  ">
                  <div className="flex items-center">
                    <img
                      className="avatar rounded-full w-10"
                      src={user.image_url}
                      alt="Profile Picture"
                    />
                    <Link
                      className="ml-2 text-white truncate"
                      to={`/profile/${user.id}`}
                    >
                      {user.username}
                    </Link>
                  </div>

                  <div>
                    <Link
                      to={`/profile/${user.id}`}
                      className=" bg-gradient-to-l from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent hover:border-b-[1px]"
                    >
                      Profile
                    </Link>
                    <Link
                      to={`/messageDashboard/${currentUser?.id}`}
                      className="mr-1 ml-2 bg-gradient-to-t from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent hover:border-b-[1px]"
                    >
                      Message
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="px-5 pt-8">
            <div>
              <div>
                <img
                  className="w-20 rounded-full"
                  src={user.image_url}
                  alt=""
                />
              </div>
            </div>
            <h1 className="ml-2 mb-5 text-3xl text-white xl:pt-1 bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent">
              {user?.username}'s Feed
            </h1>

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
                        ? "tab bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] text-[1rem] text-black "
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
                        ? "tab bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] text-[1rem] text-black "
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
                  className="px-3 py-2 rounded-2xl shadow-xl text-black bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF]  "
                >
                  <span className="text-lg">+ </span>Create Post
                </Link>
              </div>
            </div>
          </div>
          <div className="">
            <div className="divider h-0 mb-0 "></div>
            {homeFeed === "myFeed" ? <UserFeed /> : <AllPosts />}
          </div>
        </div>
      ) : (
        // HOME PAGE if user is logged out

        <div className="hero bg-base-300 text-white requires-no-scroll ">
          <div className="hero-content flex-col lg:flex-row text-left xl:mt-48">
            <div className="text-center lg:text-right lg:mr-[10rem] lg:ml-[10rem]">
              <div className="xl:w-[22rem] xl:top-[30%] w-[15rem] mr-[5rem] xl:block">
                <img
                  className="xl:h-[22rem] h-[15rem] ml-10 bg-gradient-to-b from-[#C0E8FF] to-[#ACAAFF]  rounded-[10%] shadow-xl p-2 "
                  src={Pic}
                  alt=""
                />
              </div>
            </div>
            <div className="card shrink-0 w-full max-w-md xl:min-w-fit bg-base-300">
              <div className="card-body p-0">
                <div className="bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent">
                  <header className="mt-5 mb-10  ">
                    <h1 className="text-4xl xl:text-[4.3rem] ">
                      Welcome to MyBlog!
                    </h1>
                  </header>
                </div>
                <div className="xl:flex">
                  <ul>
                    <p className="text-2xl mb-5">Blog today.</p>
                    <li className="">
                      <SignInModal />
                    </li>
                    <div className="divider">or</div>
                    <li className="">
                      <RegisterModal />
                    </li>
                    <li className="mt-4">
                      <Form onSubmit={handleGuestLogin} ref={form} className="">
                        <div className="hidden">
                          <div>
                            <Input
                              type="text"
                              name="username"
                              value={username}
                              // validations={[required]}
                              autoComplete="off"
                              className="input input-bordered shadow-lg mt-2 w-full"
                            />
                          </div>
                          <div className="mt-3">
                            <Input
                              type="password"
                              name="password"
                              value={password}
                              // validations={[required]}
                              className="input input-bordered shadow-lg mt-2 w-full "
                            />
                          </div>
                        </div>

                        <div className="xl:h-[2.5rem] xl:w-[18rem] w-[20rem] h-[3rem] rounded-full bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] p-[.2rem] ">
                          <div className="flex h-full w-full items-center justify-center bg-base-300 back rounded-full hover:bg-transparent transition duration-500  ">
                            <button className="text-[#C0E8FF]/90 text-sm  hover:text-black w-full h-full font-bold">
                              Example User Sign In
                            </button>
                          </div>
                        </div>

                        <CheckButton
                          ref={checkBtn}
                          style={{ display: "none" }}
                        />
                      </Form>
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
