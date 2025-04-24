import './App.css';
import AcknowledgementForm from './components/AcknowledgementForm';
import AdminLogin from './components/AdminLogin';
import AdminNavbar from './components/AdminNavbar';
import AdminPosts from './components/AdminPosts';
import AllPosts from './components/AllPosts';
import Analysis from './components/Analysis';
import Chatbot from './components/Chatbot';
import CreatePostForm from './components/CreatePostForm';
import Home from './components/Home';
import Login from './components/Login';
import MyPosts from './components/MyPosts';
import Navbar from './components/Navbar';
import Otp from './components/Otp';
import PostDetails from './components/PostDetails';
import Register from './components/Register';
import AcknowledgmentDetails from './components/AcknowledgmentDetails';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import SolvedPosts from './components/SolvedPosts';
import ReportPost from './components/ReportPost';
import AdminReports from './components/AdminReports';
import Profile from './components/Profile';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/adminlogin' element={<AdminLogin/>} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/otp' element={<Otp/>} />
          <Route exact path='/register' element={<Register />} />
          <Route exact path='/myposts' element={<><Navbar/><MyPosts/></>} />
          <Route exact path='/createpostform' element={<CreatePostForm/>} />
          <Route exact path='/post/:id' element={<PostDetails/>}/>
          <Route exact path='/home' element={<><Navbar/><AllPosts/></>}/>
          <Route path="/acknowledgementform/:postId" element={<AcknowledgementForm />} />
          <Route exact path='/adminhome' element={<><AdminNavbar/><AdminPosts/></>}/>
          <Route exact path='/acknowledged_posts' element={<><AdminNavbar/><SolvedPosts/></>}/>
          <Route exact path='/chatbot' element={<Chatbot/>}/>
          <Route exact path='/analysis' element={<><AdminNavbar/><Analysis/></>}/>
          <Route path="/acknowledgment-details/:postId" element={<AcknowledgmentDetails />} />
          <Route path="/user_report/:postId" element={<ReportPost />} />
          <Route path="/reports" element={<><AdminNavbar/><AdminReports/></>} />
          <Route path="/profile" element={<><Navbar/><Profile/></>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
