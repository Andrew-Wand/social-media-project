import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PostService from "../services/post.service";
import moment from "moment";
import { HiMiniHeart, HiOutlineHeart } from "react-icons/hi2";
import { FaRegCommentAlt } from "react-icons/fa";

const SinglePost = () => {
  const [singlePost, setSinglePost] = useState([]);
  const [successful, setSuccessful] = useState(false);
  // console.log(window.location.pathname.slice(-1));
  const postIdParam = window.location.pathname.slice(-1);

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
    fetchPostById(postIdParam);
  }, []);

  console.log(singlePost);

  return (
    <div className="xl:mx-[30rem]">
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
          <p className="">{singlePost?.Text}</p>
        </div>

        {/* {singlePost.map((post, i) => (
        <h1 key={i}>{post.Title}</h1>
      ))} */}
        <div className="divider"></div>

        <div>
          <div className="flex ">
            <p className="btn rounded-3xl mr-5">
              <FaRegCommentAlt className="text-lg" />
              {singlePost?.comments?.length}
            </p>
            <form>
              {singlePost?.likes?.length > 0 ? (
                <button
                  // key={i}
                  // value={i}
                  // onClick={(e) => getIndex(e, i)}
                  className="btn rounded-full"
                >
                  <HiMiniHeart className="pointer-events-none text-2xl " />
                  <p className="">{singlePost?.likes?.length}</p>
                </button>
              ) : (
                <button
                  // key={i}
                  // value={i}
                  // onClick={(e) => getIndex(e, i)}
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

      <div className="flex justify-center mb-10 ">
        <Link
          className="btn btn-wide w-11/12 rounded-full btn-outline xl:w-5/12"
          to={`/create-comment/${postIdParam}`}
        >
          Create comment
        </Link>
      </div>

      <div>
        <p className="ml-5">Comments:</p>
        <ul className="p-5">
          {singlePost?.comments &&
            singlePost?.comments.map((comment, i) => (
              <li key={i}>
                <p>{comment.comment_text}</p>
                <span>- </span>
                <Link to={`/profile/${comment.userId}`} className="mt-2 link">
                  {comment.owner}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default SinglePost;
