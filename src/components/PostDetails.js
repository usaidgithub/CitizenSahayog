import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShare } from '@fortawesome/free-solid-svg-icons';

const PostDetails = () => {
    const { id } = useParams(); // Extracts the post ID from the URL
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentingPosts, setCommentingPosts] = useState(false);
    const [expandedPosts, setExpandedPosts] = useState(false);

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/get_post/${id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch post details');
                }
                const data = await response.json();
                if (data.length > 0) {
                    setPost(data[0]); // Assuming you're getting an array with a single post
                } else {
                    setPost(null);
                }
            } catch (error) {
                console.error('Error fetching post details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [id]);

    useEffect(() => {
        const fetchPostCommentDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/get_postcomments/${id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch post comments');
                }
                const data = await response.json();
                setComments(data);
            } catch (error) {
                console.error('Error fetching post comments:', error);
            }
        };

        fetchPostCommentDetails();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!post) {
        return <div>Post not found</div>;
    }

    const handleShare = () => {
        const postUrl = `${window.location.origin}/post/${post.id}`;
        navigator.share({
            title: 'Check out this post on CitizenSahayog!',
            url: postUrl,
        }).catch(error => console.error('Error sharing:', error));
    };

    const toggleReadMore = () => {
        setExpandedPosts(!expandedPosts);
    };

    const toggleCommentSection = () => {
        setCommentingPosts(!commentingPosts);
    };

    const descriptionLimit = 100;

    const truncatedDescription = post.description && post.description.length > descriptionLimit
        ? post.description.substring(0, descriptionLimit) + '...'
        : post.description;

    return (
        <>
            <div className='posts-container'>
            <div className="post-card">
                <div className="post-header">
                    <h2 className="post-title">{post.title}</h2>
                </div>

                <div className="post-media">
                    {post.media_urls && post.media_urls.length > 0 && JSON.parse(post.media_urls).map((url, i) => (
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
                <div className="post-date">Posted on: {new Date(post.post_date).toLocaleDateString()}</div>

                <p className="post-description">
                    {expandedPosts ? post.description : truncatedDescription}
                    {post.description && post.description.length > descriptionLimit && (
                        <span
                            className="read-more"
                            onClick={toggleReadMore}
                            style={{ cursor: 'pointer' }}
                        >
                            {expandedPosts ? ' Show Less' : ' Read More'}
                        </span>
                    )}
                </p>

                <div className="post-actions">
                    <div className="action-item">
                        <FontAwesomeIcon icon={faHeart} className="icon" />
                        <span>{post.like_count}</span>
                    </div>
                    <div className="action-item" onClick={toggleCommentSection}>
                        <FontAwesomeIcon icon={faComment} className="icon" />
                        <span>Comment</span>
                    </div>
                    <div className="action-item">
                        <FontAwesomeIcon icon={faShare} className="icon" onClick={handleShare} />
                        <span>Share</span>
                    </div>
                </div>

                {/* Comment Section */}
                {commentingPosts && (
                    <div className="comment-section">
                        <div className="comments-list">
                            {comments.map((comment, i) => (
                                <div key={i} className="comment-item">
                                    <strong>{comment.user_name}</strong>: {comment.comment_text}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            </div>
        </>
    );
};

export default PostDetails;
