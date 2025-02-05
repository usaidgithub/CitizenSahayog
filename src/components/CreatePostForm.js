import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePostForm.css';
import { Link } from "react-router-dom";
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import getDownloadURL
import { v4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const categories = ['Water', 'Air', 'Infrastructure', 'Health', 'Education', 'Environment', 'Law & Order', 'Other'];
const states = ['Maharashtra', 'Uttar Pradesh', 'Bihar', 'West Bengal', 'Madhya Pradesh', 'Tamil Nadu', 'Rajasthan', 'Karnataka', 'Gujarat', 'Andhra Pradesh', 'Other'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Other'];

const CreatePostForm = () => {
    const navigate=useNavigate()
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [place, setPlace] = useState('');
    const [dob, setDob] = useState('');
    const [postUpload, setPostUpload] = useState(null);
    const [filteredCategories, setFilteredCategories] = useState(categories);
    const [filteredStates, setFilteredStates] = useState(states);
    const [filteredCities, setFilteredCities] = useState(cities);

    const handleCategoryChange = (e) => {
        const query = e.target.value.toLowerCase();
        setCategory(e.target.value);
        setFilteredCategories(categories.filter(cat => cat.toLowerCase().includes(query)));
    };

    const handleStateChange = (e) => {
        const query = e.target.value.toLowerCase();
        setState(e.target.value);
        setFilteredStates(states.filter(state => state.toLowerCase().includes(query)));
    };

    const handleCityChange = (e) => {
        const query = e.target.value.toLowerCase();
        setCity(e.target.value);
        setFilteredCities(cities.filter(city => city.toLowerCase().includes(query)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.success("Please wait until your post gets uploaded")
        if (postUpload == null) return;

        const postUrls = [];
        for (let i = 0; i < postUpload.length; i++) {
            const postRef = ref(storage, `posts/${postUpload[i].name + v4()}`);
            await uploadBytes(postRef, postUpload[i]);
            const url = await getDownloadURL(postRef);
            postUrls.push(url);
        }

        const postData = {
            title,
            category,
            description,
            state,
            city,
            place,
            dob,
            postUrl: postUrls
        };

        try{
            const response= await fetch('http://localhost:5000/create_posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
                credentials:'include'
            })
            if(response.ok){
                navigate('/myposts')
            }
        }
        
        catch(error){
            console.log("Some error occured",error)
            toast.error("Failed to add the post")
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="create-post-form">
                <h2>Create a Post</h2>

                <label htmlFor="title">Title of the Problem:</label>
                <input type="text" id="title" name="title" placeholder="Enter the problem title" onChange={(e) => setTitle(e.target.value)} required />

                <label htmlFor="category">Category:</label>
                <input type="text" id="category" name="category" list="categoryOptions" value={category} onChange={handleCategoryChange} placeholder="Start typing category" required />
                <datalist id="categoryOptions">
                    {filteredCategories.map((cat, index) => (
                        <option key={index} value={cat} />
                    ))}
                </datalist>

                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" placeholder="Describe the problem in detail" onChange={(e) => setDescription(e.target.value)} required></textarea>

                <label htmlFor="state">State:</label>
                <input type="text" id="state" name="state" list="stateOptions" value={state} onChange={handleStateChange} placeholder="Start typing state" required />
                <datalist id="stateOptions">
                    {filteredStates.map((state, index) => (
                        <option key={index} value={state} />
                    ))}
                </datalist>

                <label htmlFor="city">City:</label>
                <input type="text" id="city" name="city" list="cityOptions" value={city} onChange={handleCityChange} placeholder="Start typing city" required />
                <datalist id="cityOptions">
                    {filteredCities.map((city, index) => (
                        <option key={index} value={city} />
                    ))}
                </datalist>

                <label htmlFor="place">Place (Area/Street):</label>
                <input type="text" id="place" name="place" placeholder="Enter specific location" onChange={(e) => setPlace(e.target.value)} required />

                <label htmlFor="date">Date of Occurrence:</label>
                <input type="date" id="date" name="date" onChange={(e) => setDob(e.target.value)} required />

                <label htmlFor="media">Photos and Videos:</label>
                <input
                    type="file"
                    id="media"
                    name="media"
                    accept="image/*,video/*"
                    onChange={(e) => setPostUpload(e.target.files)}
                    multiple
                />

                <label>
                    <input type="checkbox" name="privacy" required />I agree that the government may review my profile information to verify my citizenship and validity of the complaint
                </label>

                <button type="submit">Submit</button>
                <Link to="/myposts"><button type="button">Cancel post</button></Link>
            </form>
            <ToastContainer 
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
        </div>
    );
};

export default CreatePostForm;
