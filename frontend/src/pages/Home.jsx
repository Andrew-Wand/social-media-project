import { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import PostService from "../services/post.service";
import { Link, useNavigate } from "react-router-dom";
import { HiMiniHeart, HiOutlineHeart } from "react-icons/hi2";
import UserFeed from "../components/UserFeed";
import AllPosts from "../components/AllPosts";
import Pic from "../assets/undraw_blog_post_re_fy5x.svg";

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
  // const fetchAllPosts = async (id) => {
  //   try {
  //     const allPostList = await PostService.getMyHomeFeed(id);

  //     setAllPosts(allPostList.data);
  //     if (userIdParam !== user.id) {
  //       navigate(`/main/${user.id}`);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   // const fetchAllLikes = async () => {
  //   //   try {
  //   //     const allLikesList = await PostService.getAllLikes();
  //   //     setAllLikes(allLikesList.data);
  //   //   } catch (error) {
  //   //     console.log(error);
  //   //   }
  //   // };
  //   // fetchAllLikes();
  //   fetchAllPosts(userIdParam);
  // }, []);

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
    <div className="  bg-base-300 min-h-screen xl:min-h-screen  xl:w-full  ">
      {currentUser ? (
        // HOME PAGE if user is logged in

        <div className="min-h-screen pb-5 xl:mx-[27rem]">
          <div className="px-5">
            <h1 className="ml-2 mb-5 text-3xl text-white xl:pt-5">
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
                  className="bg-[#fff] px-3 py-2 rounded-2xl shadow-xl text-black  "
                >
                  <span className="text-lg">+ </span>Create Post
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
            <div className="divider h-0 mb-0 "></div>
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

        <div className="hero bg-base-300 text-white requires-no-scroll ">
          <div className="hero-content flex-col lg:flex-row text-left xl:mt-36">
            <div className="text-center lg:text-right lg:mr-[18rem]">
              <div className="xl:w-[22rem] xl:top-[30%] w-[20rem] hidden xl:block">
                <img className="xl:h-[22rem]" src={Pic} alt="" />
              </div>
            </div>
            <div className="card shrink-0 w-full max-w-md xl:min-w-fit bg-base-300">
              <div className="card-body">
                <div>
                  <header className="mt-5 mb-10  ">
                    <h1 className="text-4xl xl:text-[4.3rem]">
                      Welcome to MyBlog!
                    </h1>
                  </header>
                </div>
                <div className="xl:flex">
                  <ul>
                    <p className="text-2xl mb-5">Blog today.</p>
                    <li className="">
                      <Link
                        to={"/sign-in"}
                        className="btn btn-wide xl:btn-sm xl:h-[2.5rem] xl:w-[18rem] w-[20rem] rounded-full  btn-info"
                      >
                        Login
                      </Link>
                    </li>
                    <div className="divider">or</div>
                    <li className="">
                      <Link
                        to={"/register"}
                        className="btn btn-wide xl:btn-sm xl:w-[18rem] xl:h-[2.5rem] w-[20rem]  btn-neutral rounded-full"
                      >
                        Sign Up
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <footer className="footer footer-center p-10 bg-base-300 text-base-content rounded xl:mt-5 fixed bottom-0 left-0 ">
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
          </footer>
        </div>

        // <div className=" xl:min-w-full xl:flex xl:min-h-full xl:mb-[20rem] ">
        //   <div className="xl:w-[25rem] xl:top-[30%]">
        //     <img className="xl:mt-20" src={Pic} alt="" />
        //   </div>
        //   <div className="flex flex-col items-start  ml-8 text-white xl:p-[3rem] xl:items-end xl:ml-18  ">
        //     <header className="mt-14 mb-14 xl:ml-[6.5rem] xl:text-right">
        //       <h1 className="text-4xl xl:text-[3rem]">Welcome to MyBlog!</h1>
        //     </header>

        //     <div>
        //       <ul>
        //         <p className="text-2xl mb-5">Blog today.</p>
        //         <li className="">
        //           <Link
        //             to={"/sign-in"}
        //             className="btn btn-wide rounded-full w-[18rem] btn-info"
        //           >
        //             Login
        //           </Link>
        //         </li>
        //         <div className="divider ">or</div>
        //         <li className="">
        //           <Link
        //             to={"/register"}
        //             className="btn btn-wide w-[18rem] btn-neutral rounded-full"
        //           >
        //             Sign Up
        //           </Link>
        //         </li>
        //       </ul>
        //     </div>
        //   </div>
        // </div>
      )}
    </div>
  );
};

export default Home;
