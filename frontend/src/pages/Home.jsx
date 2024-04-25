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

    // form.current.validateAll();

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
    // navigate(`/main/${currentUser.id}`);
    // window.location.reload();
  };

  const getIndex = (e, index) => {
    setKeyIndex(e.target.value, index);
  };

  // console.log(guestUsername);

  return (
    <div className="  bg-base-300 min-h-screen xl:min-h-screen  xl:w-full   ">
      {user ? (
        // HOME PAGE if user is logged in

        <div className="min-h-screen pb-5 xl:mx-[32rem] xl:border-x-2 xl:border-x-neutral-500/50">
          <div className="px-5 pt-16">
            <h1 className="ml-2 mb-5 text-3xl text-white xl:pt-5 bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent">
              {currentUser?.username}'s Feed
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
                      {/* <form onSubmit={handleGuestLogin}>
                        <button className="btn text-black btn-wide xl:btn-sm xl:h-[2.5rem] xl:w-[18rem] w-[20rem] rounded-full bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF]">
                          Example User Sign In
                        </button>
                      </form> */}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* <footer className="footer footer-center p-10 bg-base-300 text-base-content rounded xl:mt-5 fixed bottom-0 left-0 hidden xl:flex xl:justify-end">
            <nav className="grid grid-flow-col gap-4">
              <a className="link link-hover">About us</a>
              <a className="link link-hover">Contact</a>
              <a className="link link-hover">Jobs</a>
              <a className="link link-hover">Press kit</a>
            </nav>
            <nav>
              <div className="grid grid-flow-col gap-4">
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                  </svg>
                </a>
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                  </svg>
                </a>
              </div>
            </nav>
            <aside>
              <p>
                Copyright © 2024 - All right reserved by ACME Industries Ltd
              </p>
            </aside>
          </footer> */}
        </div>
      )}
    </div>
  );
};

export default Home;
