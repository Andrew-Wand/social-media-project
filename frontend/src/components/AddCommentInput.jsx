import { useState } from "react";
import PostService from "../services/post.service";
import AuthService from "../services/auth.service";
import { useNavigate } from "react-router";

const AddCommentInput = () => {
  const [commentInput, setCommentInput] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const queryString = window.location.pathname;
  const postId = queryString.slice(-1);

  const currentUser = AuthService.getCurrentUser();
  const owner = currentUser.username;
  const id = currentUser.id;
  const handleAddComment = (e) => {
    e.preventDefault();
    PostService.postCreateComment(commentInput, postId, id, owner).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        setLoading(true);
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

    navigate(`/post/${postId}`);
  };

  const commentInputOnChange = (e) => {
    setCommentInput(e.target.value);
  };

  return (
    <>
      {loading ? (
        "loading"
      ) : (
        <div className="p-10 ">
          <form onSubmit={handleAddComment} className="flex flex-col">
            <label htmlFor="">Add comment</label>
            <textarea
              value={commentInput}
              onChange={commentInputOnChange}
              type="text"
            />

            <button className="btn">Submit</button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddCommentInput;
