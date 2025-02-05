import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShare,faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';
import './MyPosts.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState({});
  const [likesQueue, setLikesQueue] = useState([]); // Queue for batch processing
  const [commentingPosts, setCommentingPosts] = useState({}); // Track which post is being commented on
  const [comments, setComments] = useState({}); // Track comments for each post
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State to control modal visibility
  const [postToDelete, setPostToDelete] = useState(null); // Store post ID to delete


  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/fetch_posts', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const items = await response.json();
        setPosts(items);

        // Initialize likedPosts and comments state
        const likedPostsData = {};
        items.forEach(post => {
          likedPostsData[post.id] = post.user_liked
        });
        setLikedPosts(likedPostsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('http://localhost:5000/fetch_comments', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const items = await response.json();
        const commentsData = {};
        items.forEach(comment => {
          const postKey = `post_${comment.post_id}_comments`;

          // If the post already has comments, append the new comment; otherwise, create a new array
          if (commentsData[postKey]) {
            commentsData[postKey].push({
              text: comment.comment_text || '',
              full_name: comment.user_name || '',
            });
          } else {
            commentsData[postKey] = [{
              text: comment.comment_text || '',
              full_name: comment.user_name || '',
            }];
          }
        });
        setComments(commentsData)
        console.log("Comments data are", commentsData)
      }
      catch (error) {
        console.log("Some error occured", error)
      }
    }

    fetchComments()
  }, [])
  // Toggle expanded state for read more/less functionality
  const toggleReadMore = (index) => {
    setExpandedPosts(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
   //Handle delete post functionality
   const toggleOptionsMenu = (postId) => {
    setIsOptionsMenuOpen(prev => ({
      ...prev,
      [postId]: !prev[postId] // Toggle the state for the specific post ID
    }));
  };
  

const handleDelete = async() => {
  if (postToDelete !== null) {
    try {
      const response = await fetch('http://localhost:5000/delete_post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ postId: postToDelete }),
      });
      if (response.ok) {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postToDelete));
        setShowDeleteModal(false); // Close the modal
        setPostToDelete(null); // Reset post to delete
        toast.success("Post deleted Successfully")
      } else {
        console.error('Error deleting the post');
        toast.error("Failed to delete the post")
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }
};
// Toggle delete modal and set post ID
const confirmDelete = (postId) => {
  setPostToDelete(postId);
  setShowDeleteModal(true);
};

// Close the delete modal without deleting
const cancelDelete = () => {
  setShowDeleteModal(false);
  if (postToDelete !== null) {
    setIsOptionsMenuOpen(prev => ({
      ...prev,
      [postToDelete]: false // Close the options menu for the specific post ID
    }));
  }
  setPostToDelete(null);
};
  // Handle like/dislike button click
  const handleLike = (postId, index) => {
    // Optimistic UI update
    setLikedPosts(prevState => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));

    // Add to the queue
    setLikesQueue(prevQueue => [
      ...prevQueue,
      { postId, liked: !likedPosts[postId] }
    ]);
  };

  // Toggle comment section visibility
  const toggleCommentSection = (postId) => {
    setCommentingPosts(prevState => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  // Handle comment input change
  const handleCommentChange = (postId, value) => {
    setComments(prevState => ({
      ...prevState,
      [postId]: value,
    }));
  };

  // Handle posting comment
  const handlePostComment = async (postId, username) => {
    // Add the new comment to the list of comments for the post
    const newComment = {
      full_name: username,
      text: comments[postId],
    };
    if (newComment.text.trim().length > 0) {
      try {
        const response = await fetch('http://localhost:5000/add_comment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            postId,
            comment: newComment,
          }),
        });

        if (response.ok) {
          console.log("Data added Successfully")
          setComments(prevState => ({
            ...prevState,
            [postId]: '', // Clear the comment input
            [`post_${postId}_comments`]: [
              ...(prevState[`post_${postId}_comments`] || []),
              newComment,
            ],
          }));
        } else {
          console.error('Failed to save the comment');
        }
      }
      catch (error) {
        console.error('Error posting comment:', error);
      }
    }

  };

  // Batch processing useEffect
  useEffect(() => {
    const processLikesQueue = async () => {
      if (likesQueue.length > 0) {
        try {
          const response = await fetch('http://localhost:5000/batch_like', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(likesQueue),
          });
          if (response.ok) {
            console.log("Batch processed successfully");
            setLikesQueue([]); // Clear the queue on successful processing
          } else {
            console.error('Batch processing failed');
          }
        } catch (error) {
          console.error('Error processing batch:', error);
        }
      }
    };

    // Set interval for batch processing
    const batchInterval = setInterval(processLikesQueue, 5000); // Process every 5 seconds

    return () => clearInterval(batchInterval); // Cleanup on component unmount
  }, [likesQueue, likedPosts]);
  const handleShare = (postId) => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    navigator.share({
      title: 'Check out this post on CitizenSahayog!',
      url: postUrl,
    }).catch(error => console.error('Error sharing:', error));
  };
  const descriptionLimit = 100; // Character limit for truncation

  return (
    <>
      <div className='add_posts'>
        <Link to="/createpostform">
          <button className='addpost'>Create a post</button>
        </Link>
      </div>
      <div className="posts-container">
        {posts.map((post, index) => {
          const mediaUrls = typeof post.media_urls === 'string' ? JSON.parse(post.media_urls) : post.media_urls;
          const isExpanded = expandedPosts[index];
          const isLiked = likedPosts[post.id];
          const isCommenting = commentingPosts[post.id];
          const postComments = comments[`post_${post.id}_comments`] || [];
          const truncatedDescription = post.description.length > descriptionLimit
            ? post.description.substring(0, descriptionLimit) + '...'
            : post.description;

          return (
            <div className="post-card" key={index}>
              <div className="post-header">
                <h2 className="post-title">{post.title}</h2>
                <div className="post-options">
                  <FontAwesomeIcon icon={faEllipsisV} className="options-icon" onClick={() => toggleOptionsMenu(post.id)} />
                  {isOptionsMenuOpen[post.id] && (
                    <div className="post-options-menu">
                      <button className="delete-button" onClick={() => confirmDelete(post.id)}>Delete Post</button>
                    </div>
                  )}
            
                </div>
              </div>

              <div className="post-media">
                {mediaUrls && mediaUrls.length > 0 && mediaUrls.map((url, i) => (
                  <div key={i} className="media-item">
                    {url.endsWith('.mp4') ? (
                      <video controls src={url} alt="Post Video" />
                    ) : (
                      // eslint-disable-next-line
                      <img src={url} alt="Post Image" />
                    )}
                  </div>
                ))}
              </div>

              <div className="post-details">
                <div className="post-category-date">
                  <span className="post-category">Category: {post.category}</span>
                  <span className="post-date">Date: {new Date(post.date_of_occurrence).toLocaleDateString()}</span>
                </div>
                <div className="post-location">
                  <span className="post-state">State: {post.state}</span>
                  <span className="post-city">City: {post.city}</span>
                </div>
                <div className="post-place">Location: {post.place}</div>
              </div>
              <div className="post-id">
                <span className='post-date'>Posted on: {new Date(post.post_date).toLocaleDateString()}</span>
                <span className='post-date'>Unique Post Id: {post.id}</span>
              </div>

              <p className="post-description">
                {isExpanded ? post.description : truncatedDescription}
                {post.description.length > descriptionLimit && (
                  <span
                    className="read-more"
                    onClick={() => toggleReadMore(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    {isExpanded ? ' Show Less' : ' Read More'}
                  </span>
                )}
              </p>
              <div className="post-actions">
                <div className="action-item" onClick={() => handleLike(post.id, index)}>
                  <FontAwesomeIcon icon={faHeart} className={`icon ${isLiked ? 'liked' : ''}`} />
                  <span>{isLiked ? post.like_count + 1 : post.like_count || 0}</span>
                </div>
                <div className="action-item" onClick={() => toggleCommentSection(post.id)}>
                  <FontAwesomeIcon icon={faComment} className="icon" />
                  <span>Comment</span>
                </div>
                <div className="action-item">
                  <FontAwesomeIcon icon={faShare} className="icon" onClick={() => handleShare(post.id)} />
                  <span>Share</span>
                </div>
              </div>

              {/* Comment Section */}
              {isCommenting && (
                <div className="comment-section">
                  <textarea
                    className="comment-input"
                    placeholder="Write a comment..."
                    value={comments[post.id] || ''}
                    onChange={(e) => handleCommentChange(post.id, e.target.value)}
                  />
                  <button className="post-comment-button" onClick={() => handlePostComment(post.id, post.full_name)}>
                    Post Comment
                  </button>

                  {/* Display Comments */}
                  <div className="comments-list">
                    {postComments.map((comment, i) => (
                      comment.text ? (
                        <div key={i} className="comment-item">
                          <strong>{comment.full_name}</strong>: {comment.text}
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Modal
        show={showDeleteModal}
        message="Do you really want to delete this post?"
        onConfirm={handleDelete}
        onCancel={cancelDelete}
      />
       <ToastContainer 
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
