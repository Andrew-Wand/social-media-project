import { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import PostService from "../services/post.service";
import { Link } from "react-router-dom";

const Home = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [allPosts, setAllPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [singlePost, setSinglePost] = useState([]);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const allPostList = await PostService.getAllPosts();
        setAllPosts(allPostList.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllPosts();
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

  // console.log(singlePost);

  const usernameId = allUsers.map((user) => {
    const derp = {
      username: user.username,
      id: user.id,
    };
    return derp;
  });

  const postUserId = allPosts.map((post) => {
    const newPost = {
      postId: post.userId,
    };

    return newPost;
  });

  let compareTwoArrayOfObjects = (usernameId, postUserId) => {
    return usernameId.every((element_1) =>
      postUserId.some((element_2) =>
        Object.keys(element_1).every((key) => element_1[key] === element_2[key])
      )
    );
  };

  // console.log(compareTwoArrayOfObjects(usernameId, postUserId));

  return (
    <>
      {currentUser ? (
        // HOME PAGE if user is logged in

        <div className="h-screen bg-slate-400">
          <div className="p-10">
            <Link to="/create-post" className="btn">
              Create Post
            </Link>
          </div>
          <div>
            <ul>
              {allPosts.map((post, i) => (
                <li
                  className="bg-slate-500 text-black my-10 p-10 m-5 rounded-lg shadow-lg"
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
                  <p>
                    Posted By:
                    <Link to={`/profile/${post.userId}`} className="btn">
                      {post.owner}
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
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
    </>
  );
};

export default Home;
