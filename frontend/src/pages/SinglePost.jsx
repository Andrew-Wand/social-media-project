import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PostService from "../services/post.service";
import AuthService from "../services/auth.service";
import moment from "moment";
import { HiMiniHeart, HiOutlineHeart } from "react-icons/hi2";
import { FaRegCommentAlt } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";

const SinglePost = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [singlePost, setSinglePost] = useState([]);
  const [postComments, setPostComments] = useState([]);
  const [successful, setSuccessful] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [totalLikes, setTotalLikes] = useState();
  const [message, setMessage] = useState("");
  const [keyIndex, setKeyIndex] = useState();
  const [isLoading, setIsLoading] = useState(null);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalComments, setTotalComments] = useState();
  // console.log(window.location.pathname.slice(-1));
  // const postIdParam = window.location.pathname.slice(-1);
  // const postIdParamTwoDigit = window.location.pathname.slice(-2);

  const postIdParam = window.location.pathname.split("/").pop();
  // console.log(last);

  const user = AuthService.getCurrentUser();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const fetchPostById = async (id) => {
    try {
      const postById = await PostService.getSinglePost(id);
      setSinglePost(postById.data);
      setSuccessful(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // if (Number(postIdParam)) {
    //   fetchPostById(postIdParam);
    // } else {
    //   fetchPostById(postIdParamTwoDigit);

    // }

    fetchPostById(postIdParam);
  }, [page]);

  const fetchPostComments = async () => {
    const params = getRequestParams(page, pageSize);
    try {
      const commentsByPostId = await PostService.getPostComments(
        postIdParam,
        params
      );
      const { comments, totalPages } = commentsByPostId.data;

      setPostComments(comments);
      setCount(totalPages);
      setTotalComments(commentsByPostId.data.totalItems);

      setSuccessful(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPostComments();
  }, []);

  // Pagination handling
  const handlePageChange = (e, value) => {
    setPage(value);

    // fetchPostComments();
  };
  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPage(1);
    () => fetchPostComments();
  };

  // CREATE LIKE FUNCTION
  const handleCreateLike = async (e) => {
    e.preventDefault();

    // setKeyIndex(e.target.getAttribute("key"));
    // console.log(e.target.entry, index);
    const userId = user.id;
    const username = user.username;
    const fart = Number(keyIndex);
    const like = likeCount + 1;
    setIsLoading(true);
    // console.log(fart);

    PostService.createLike(like, username, fart, userId).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        setIsLoading(false);
        // console.log(response.config.data.slice(-2, -1));
        if (Number(postIdParam)) {
          fetchPostById(postIdParam);
        } else {
          fetchPostById(postIdParamTwoDigit);
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
        setIsLoading(false);
      }
    );
  };

  const getIndex = (e) => {
    setKeyIndex(e.target.value);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getRequestParams = (page, pageSize) => {
    let params = {};

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    return params;
  };
  console.log(postComments);
  return (
    <div className="bg-base-300 min-h-screen ">
      <div className="xl:mx-[30rem] xl:border-x-2 xl:border-x-neutral-500/50 xl:h-screen ">
        <div className="flex flex-col p-5">
          <div className="flex text-sm mb-2">
            <Link to={`/profile/${singlePost?.userId}`} className="link">
              {singlePost?.owner}
            </Link>
            <p className="mx-2">•</p>
            <p className="">{`${moment(singlePost?.createdAt).format("L")}`}</p>
          </div>
          <div>
            <h1 className="font-bold text-white text-xl mb-7">
              {singlePost?.Title}
            </h1>
            <p className="whitespace-pre-wrap">{singlePost?.Text}</p>
          </div>

          {/* {singlePost.map((post, i) => (
        <h1 key={i}>{post.Title}</h1>
      ))} */}
          <div className="divider"></div>

          <div>
            <div className="flex ">
              <p className="btn rounded-3xl mr-5">
                <FaRegCommentAlt className="text-lg" />
                {totalComments}
              </p>
              <form onSubmit={handleCreateLike}>
                {singlePost?.likes?.length > 0 ? (
                  <button
                    value={singlePost?.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      getIndex(e);
                    }}
                    className="btn rounded-full"
                  >
                    <HiMiniHeart className="pointer-events-none text-2xl text-[#de2a43]" />
                    <p className="">{singlePost?.likes?.length}</p>
                  </button>
                ) : (
                  <button
                    value={singlePost?.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      getIndex(e);
                    }}
                    className="btn rounded-full"
                  >
                    <HiOutlineHeart className="pointer-events-none text-2xl text-slate-300 " />
                    <p className="">{singlePost?.likes?.length}</p>
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-7 ">
          <Link
            className="btn btn-wide w-11/12 rounded-full btn-outline xl:w-5/12 bg-base-300 back rounded-full hover:bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] transition duration-300  "
            to={`/create-comment/${postIdParam}`}
          >
            Create comment
          </Link>
        </div>
        <div className="divider"></div>
        <div>
          <p className="ml-5">Comments:</p>
          {/* {postComments?.length === 0 && <p>There are no comments yet!</p>} */}

          <ul className="p-5">
            {postComments?.length > 0 &&
              postComments?.map((comment, i) => (
                <li key={i} className="mb-5">
                  <div className="flex items-center text-[.8rem] mb-1 ">
                    <Link
                      to={`/profile/${comment.userId}`}
                      className="font-bold link"
                    >
                      {comment.owner}
                    </Link>
                    <p className="mx-2">•</p>
                    <span className=" ">
                      {`${moment(comment.createdAt).format("l")} ` +
                        `${moment(comment.createdAt).format("LT")}`}
                    </span>
                  </div>

                  <div className="text-[.9rem]">
                    <p>{comment.comment_text}</p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
        <div className="divider"></div>
        {postComments?.length > 0 ? (
          <Pagination
            className="flex justify-center mt-2"
            count={count}
            page={page}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            color="primary"
            onChange={handlePageChange}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default SinglePost;
