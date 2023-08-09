import React, { useState, useEffect } from "react";
import Comment from "../comment/Comment";
import "./Post.css";

const Post = ({ post, setPosts, newPosts }) => {
  let comments = post.comments;
  let commentList = comments?.map((comment) => (
    <p>
      {" "}
      <Comment comment={comment} key={comment._id} />{" "}
    </p>
  ));

  const userid = window.localStorage.getItem("userid");
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [liked, setLiked] = useState(post?.likes?.includes(userid));
  const length = post?.likes?.length;
  const [likesCount, setLikesCount] = useState(length);
  const handleLike = async () => {
    try {
      const response = await fetch(`posts/${post._id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (response.status === 201) {
        const data = await response.json();

        setLiked(true);
        setLikesCount(data.likes.length);
        fetch("/posts", {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).then(async (response) => {
          if (response.status === 200) {
            let data1 = await response.json();
            let UpdatedPosts = data1.posts;
            setPosts(UpdatedPosts);
          } else {
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (postId, token, setPosts) => {
    fetch(`/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("Response status:", response.status);
        if (response.status === 200) {
          // Remove the deleted post from the posts state
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post._id !== postId)
          );
        } else if (response.status === 403) {
          console.error("You are not allowed to delete this post.");
        } else {
          console.error("Error deleting a post");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const showDeleteButton = post.user._id === userid;
  if (post.user === null) {
    return (
      <article data-cy="post">
        {" "}
        <p>ERROR</p>
      </article>
    );
  } else {
    return (
      <article data-cy="post">
        <div className="post" key={post._id}>
          <h2>{post.user.username}:</h2>
          <p>
            <h1>{post.message}</h1>
          </p>
          <div>{commentList}</div>
          <button
            className="like-button"
            onClick={handleLike}
            disabled={liked}
            title={liked ? "You liked this post" : "Like this post"}
          >
      {liked ? "❤️" : "🤍"}
      {likesCount > 0 && (
        <span className="like-count">{likesCount}</span>
          )}
        </button>
          {showDeleteButton && (
            <button
              data-cy="delete-button"
              className="delete-button"
              onClick={() => handleDelete(post._id, token, setPosts)}
              title="Delete this post"
            >
              <span className="button-icon">🗑️</span>
              <span className="button-text">Delete</span>
            </button>
          )}
        </div>
      </article>
    );
  }
};

export default Post;
