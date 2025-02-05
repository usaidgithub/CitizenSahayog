import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import './MyPosts.css';


export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [likesQueue, setLikesQueue] = useState([]); // Queue for batch processing
  const [commentingPosts, setCommentingPosts] = useState({}); // Track which post is being commented on
  const [comments, setComments] = useState({}); // Track comments for each post 
  const [states, setStates] = useState([]); // State dropdown options
  const [cities, setCities] = useState([]); // City dropdown options
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchPostId, setSearchPostId] = useState('');

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/fetch_allposts', {
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
    const fetchStatesAndCities = async () => {
      try {
        const response = await fetch('http://localhost:5000/fetch_states', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const data = await response.json();
        setStates(data || []); // Ensure data is properly set
      
        const response1 = await fetch('http://localhost:5000/fetch_cities', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const data1 = await response1.json();
        setCities(data1 || []); // Ensure cities data is properly set
      } catch (error) {
        console.error('Error fetching states and cities:', error);
      }
    };
    fetchPosts();
    fetchStatesAndCities()
  }, []);
  useEffect(()=>{
    const fetchComments=async()=>{
      try{
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
        console.log("Comments data are",commentsData)
      }
      catch(error){
        console.log("Some error occured",error)
      }
    }
    
    fetchComments()
  },[])
  // Toggle expanded state for read more/less functionality
  const toggleReadMore = (index) => {
    setExpandedPosts(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
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
    if(newComment.text.trim().length > 0){
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
// Filter posts by selected state and city
const filteredPosts = posts.filter(post => {
  if (searchPostId) {
    return post.id.toString() === searchPostId; // Ensure comparison is made between strings
  }
  if (selectedState !== 'All' && post.state !== selectedState) return false;
  if (selectedCity !== 'All' && post.city !== selectedCity) return false;
  return true;
});
  return (
    <>
     <div className="sort-options">
  <select value={selectedState} onChange={e => setSelectedState(e.target.value)}>
    <option value="All">All States</option>
    {states.map((state, index) => (
      <option key={index} value={state}>{state}</option>
    ))}
  </select>

  <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
    <option value="All">All Cities</option>
    {cities.map((city, index) => (
      <option key={index} value={city}>{city}</option>
    ))}
  </select>

  <div className="search-container">
    <input
      type="text"
      placeholder="Search post by ID"
      value={searchPostId}
      onChange={(e) => setSearchPostId(e.target.value)} // Capture user input
    />
  </div>
</div>


      <div className="posts-container">
      {filteredPosts.length === 0 ? (
          <p>No posts available for the selected state and city.</p>
        ) : (
          filteredPosts.map((post, index) => {
            const mediaUrls = typeof post.media_urls === 'string' ? JSON.parse(post.media_urls) : post.media_urls;
            const isExpanded = expandedPosts[index];
            const isLiked = likedPosts[post.id];
            const isCommenting = commentingPosts[post.id];
            const postComments = comments[`post_${post.id}_comments`] || [];
            const truncatedDescription = post.description.length > 100
              ? post.description.substring(0, 100) + '...'
              : post.description;

          return (
            <div className="post-card" key={index}>
              <div className="post-header">
                <h2 className="post-title">{post.title}</h2>
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
                  <button className="post-comment-button" onClick={() => handlePostComment(post.id, post.logged_in_user_full_name)}>
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
        })
      )}
    </div>
    </>
  );
}