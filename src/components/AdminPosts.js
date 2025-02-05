import React, { useEffect, useState } from 'react';
import './MyPosts.css';


export default function AdminPosts() {
    const [posts, setPosts] = useState([]);
    const [expandedPosts, setExpandedPosts] = useState({});
    const [states, setStates] = useState([]); // State dropdown options
    const [cities, setCities] = useState([]); // City dropdown options
    const [selectedState, setSelectedState] = useState('All');
    const [selectedCity, setSelectedCity] = useState('All');
    const [searchPostId, setSearchPostId] = useState('');

    // Fetch posts on component mount
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:5000/fetch_adminposts', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const items = await response.json();
                setPosts(items);
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

    // Toggle expanded state for read more/less functionality
    const toggleReadMore = (index) => {
        setExpandedPosts(prevState => ({
            ...prevState,
            [index]: !prevState[index],
        }));
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
                            <button type='button'>Fill the post acknowledgemwnt form</button>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}