import { useState, useEffect } from "react";
import PostService from "../services/post.service";

const SinglePost = () => {
  const [singlePost, setSinglePost] = useState([]);
  //   console.log(window.location.pathname.slice(-1));
  const postIdParam = window.location.pathname.slice(-1);
  useEffect(() => {
    const fetchPostById = async (id) => {
      try {
        const postById = await PostService.getSinglePost(id);
        setSinglePost(postById.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPostById(postIdParam);
  }, []);

  //   console.log(singlePost);

  return (
    <div>
      <h1>{singlePost.Title}</h1>
      <p>{singlePost.Text}</p>
      {/* {singlePost.map((post, i) => (
        <h1 key={i}>{post.Title}</h1>
      ))} */}
    </div>
  );
};

export default SinglePost;
