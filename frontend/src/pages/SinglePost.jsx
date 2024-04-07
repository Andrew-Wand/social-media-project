import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PostService from "../services/post.service";

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
  }, [successful]);

  // console.log(singlePost);

  return (
    <div>
      <h1>{singlePost.Title}</h1>
      <p>{singlePost.Text}</p>
      {/* {singlePost.map((post, i) => (
        <h1 key={i}>{post.Title}</h1>
      ))} */}
      <div className="divider"></div>

      <Link className="btn" to={`/create-comment/${postIdParam}`}>
        Create comment
      </Link>

      <div>
        <h2>Comments:</h2>
        <ul className="p-10">
          {singlePost.comments &&
            singlePost.comments.map((comment, i) => (
              <li key={i}>
                <p>{comment.comment_text}</p>
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
