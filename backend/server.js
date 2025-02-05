const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cors = require('cors');
const app = express();
const path=require('path')
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true
}));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'shahin124',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 1800000, 
        httpOnly: true,
        secure: false,      // Set to false because your app uses HTTP
        sameSite: 'lax'     // Suitable for cross-site requests (like APIs)
    }
}));

const noCacheMiddleware = (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT');
    next();
};

app.use(noCacheMiddleware);
app.use(express.static(path.join(__dirname, 'public')));

const port = 5000;
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'citizenSahayog',
});
connection.connect((err) => {
    if (err) {
        console.log("Connection with MySQL failed", err);
    } else {
        console.log("Connection established successfully");
    }
});
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Decryption function
function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
  };
app.post('/register',async(req,res)=>{
    const{fullName,dob,gender,mobileNumber,permanentAddress,currentAddress,aadharNumber,panNumber,voterID,email,username,password}=req.body
    const hashedPassword = await bcrypt.hash(password, 10);
    const encryptedAadharNumber = encrypt(aadharNumber);
    const encryptedPanNumber = panNumber ? encrypt(panNumber) : null;
    const encryptedVoterID = voterID ? encrypt(voterID) : null;
    const sql = 'INSERT INTO citizen_registration (full_name, dob, gender, mobile_number, permanent_address, current_address, aadhaar_number, pan_number, voter_id, email, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql,[fullName,dob,gender,mobileNumber,permanentAddress,currentAddress,encryptedAadharNumber,encryptedPanNumber,encryptedVoterID,email,username,hashedPassword],(err,results)=>{
        if(err){
            throw err
        }else{
            res.status(200).send('Registration successful')
        }
    })
})
app.post('/login_user', (req, res) => {
    console.log("Handling user login");
    const { username, password } = req.body;
    connection.query('SELECT id, password FROM citizen_registration WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error("Error during login", err);
            return res.status(500).send("Server error");
        }
        if (results.length > 0) {
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                req.session.userId = user.id;
                req.session.save((err) => {
                    if (err) {
                        console.error("Session save error", err);
                        return res.status(500).send("Server error");
                    }
                    console.log("Login successful", "session data:", req.session);
                    return res.status(200).send("Login successful");
                });
            } else {
                console.log("Invalid credentials - password mismatch");
                return res.status(401).send("Invalid credentials");
            }
        } else {
            console.log("Invalid credentials - username not found");
            return res.status(401).send("Invalid credentials");
        }
    });
});
app.post('/create_posts', (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(400).send("User is not logged in.");
    }
    const { title, category, description, state, city, place, dob, postUrl } = req.body;
    const sql = 'INSERT INTO posts(citizen_id, title, category, description, state, city, place, date_of_occurrence, media_urls) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [userId, title, category, description, state, city, place, dob, JSON.stringify(postUrl)], (err, results) => {
        if (err) {
            throw err;
        }
        res.status(200).send("Post added successfully");
    });
});
app.post('/delete_post',(req,res)=>{
    const userId=req.session.userId
    if(!userId){
        return res.status(400).send("User is not logged in.");
    }
    const{postId}=req.body
    const sql='DELETE FROM posts WHERE id=? AND citizen_id=?'
    connection.query(sql,[postId,userId],(err,results)=>{
        if(err){
            throw err
        }
        else{
            res.status(200).send("Post deleted successfully");
        }
    })
})
app.get('/fetch_posts',(req,res)=>{
    const userId=req.session.userId
    const sql=`
    SELECT 
    posts.id, 
    posts.title, 
    posts.description, 
    posts.media_urls, 
    posts.category, 
    posts.date_of_occurrence, 
    posts.state, 
    posts.city, 
    posts.place, 
    posts.post_date,
    COALESCE(likes.like_count, 0) AS like_count,
    CASE 
        WHEN EXISTS (SELECT 1 FROM post_likes WHERE post_likes.post_id = posts.id AND post_likes.citizen_id = ?) 
        THEN true ELSE false 
    END AS user_liked,
    citizen_registration.full_name
    
FROM 
    posts
LEFT JOIN 
    (SELECT post_id, COUNT(*) AS like_count 
     FROM post_likes 
     GROUP BY post_id) AS likes 
ON 
    posts.id = likes.post_id
INNER JOIN
    citizen_registration -- Joining with citizen_registration to get the full name
ON 
    posts.citizen_id = citizen_registration.id

WHERE 
    posts.citizen_id = ? 
ORDER BY 
    posts.post_date DESC;


`
    connection.query(sql,[userId,userId],(err,results)=>{
        if(err){
            throw err
        }

        res.status(200).json(results)
       })
})
app.get('/fetch_allposts',(req,res)=>{
    const userId=req.session.userId
    const sql=`
    SELECT 
    posts.id, 
    posts.title, 
    posts.description, 
    posts.media_urls, 
    posts.category, 
    posts.date_of_occurrence, 
    posts.state, 
    posts.city, 
    posts.place, 
    posts.post_date,
    COALESCE(likes.like_count, 0) AS like_count,
    CASE 
        WHEN EXISTS (SELECT 1 FROM post_likes WHERE post_likes.post_id = posts.id AND post_likes.citizen_id = ?) 
        THEN true ELSE false 
    END AS user_liked,
    logged_in_user.full_name AS logged_in_user_full_name
    
FROM 
    posts
LEFT JOIN 
    (SELECT post_id, COUNT(*) AS like_count 
     FROM post_likes 
     GROUP BY post_id) AS likes 
ON 
    posts.id = likes.post_id
INNER JOIN
    citizen_registration AS post_creator -- Joining to get the post creator's full name
ON 
    posts.citizen_id = post_creator.id
INNER JOIN
    citizen_registration AS logged_in_user -- Joining to get the currently logged-in user's full name
ON 
    logged_in_user.id = ?-- This should be the ID of the currently logged-in user

WHERE 
    posts.citizen_id <> ?
ORDER BY 
    posts.post_date DESC;




`
    connection.query(sql,[userId,userId,userId],(err,results)=>{
        if(err){
            throw err
        }

        res.status(200).json(results)
       })
})
app.get('/get_post/:id',  (req, res) => {
    const postId = req.params.id;
    const sql = `
        SELECT 
            p.id,
            p.title,
            p.category,
            p.description,
            p.state,
            p.city,
            p.place,
            p.date_of_occurrence,
            p.media_urls,
            p.post_date,
            COUNT(pl.id) AS like_count
        FROM 
            posts p
        LEFT JOIN 
            post_likes pl ON p.id = pl.post_id
        WHERE 
            p.id = ?
        GROUP BY 
            p.id;
    `;
    connection.query(sql,[postId],(err,results)=>{
        if(err){
            throw err
        }
        res.status(200).json(results)
    })
    
});
app.get('/get_postcomments/:id',(req,res)=>{
    const postId=req.params.id
    const sql=`SELECT * FROM comments WHERE post_id=?`
    connection.query(sql,[postId],(err,results)=>{
        if(err){
            throw err
        }
        res.status(200).json(results)
    })
})
app.get('/fetch_comments',(req,res)=>{
    const sql='SELECT * FROM comments'
    connection.query(sql,(err,results)=>{
        if(err){
            throw err
        }
        res.status(200).json(results)
    })
})
app.post('/batch_like', async (req, res) => {
        const likesBatch = req.body; 
        const citizenId = req.session.userId;
    
        try {
            for (const action of likesBatch) {
                const { postId, liked } = action;
                if (liked) {
                    // User liked the post - insert into post_likes table
                     connection.query('INSERT INTO post_likes (post_id, citizen_id) VALUES (?, ?)', [postId, citizenId]);
                } else if (!liked) {
                    // User disliked the post - remove from post_likes table
                     connection.query('DELETE FROM post_likes WHERE post_id = ? AND citizen_id = ?', [postId, citizenId]);
                }
            }
            res.status(200).send('Batch processed successfully');
        } catch (error) {
            console.error('Error processing batch:', error);
            res.status(500).send('Failed to process batch');
        }

});
app.post('/add_comment',(req,res)=>{
    const { postId, comment } = req.body;
    const userId=req.session.userId
  try {
     connection.query(
      'INSERT INTO comments (post_id,citizen_id,user_name,comment_text) VALUES (?,?,?,?)',
      [postId,userId,comment.full_name, comment.text],(err,results)=>{
        if(err){
            throw err
        }
        res.status(200).json("Comment Saved Successfully");
      }
    );

  } catch (error) {
    console.error('Error saving comment:', error);
    res.status(500).json({ error: 'Failed to save comment' });
  }
})
app.get('/fetch_states',(req,res)=>{
    const query = 'SELECT DISTINCT state FROM posts WHERE state IS NOT NULL AND state != ""';
    connection.query(query, (err, result) => {
      if (err) {
        console.error('Error fetching states:', err);
        return res.status(500).json({ error: 'Failed to fetch states' });
      }
      const states = result.map(row => row.state);
      res.json(states);
    });
})
app.get('/fetch_cities',(req,res)=>{
    const query = 'SELECT DISTINCT city FROM posts WHERE city IS NOT NULL AND city != ""';
    connection.query(query, (err, result) => {
      if (err) {
        console.error('Error fetching cities:', err);
        return res.status(500).json({ error: 'Failed to fetch cities' });
      }
      const cities = result.map(row => row.city);
      res.json(cities);
    });
})
app.post('/admin/login', (req, res) => {
    const { adminId } = req.body; // Extract the adminId from the request
  
    // Check if the adminId exists in the database
    const query = 'SELECT * FROM admin_login WHERE admin_id = ?';
    connection.query(query, [adminId], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Server error' });
      }
  
      // If the adminId exists, redirect to the OTP page
      if (result.length > 0) {
        const otp = generateOtp();
        console.log('Generated OTP:', otp); // Print OTP in the console

        // Respond with success and OTP (in a real scenario, send this to the phone/email)
        return res.status(200).json({ success: true, otp });
      } else {
        // If the adminId is not found, send an error response
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    });
  });
  app.get('/fetch_adminposts', (req, res) => {
    const sql = `
    SELECT 
        posts.id, 
        posts.title, 
        posts.description, 
        posts.media_urls, 
        posts.category, 
        posts.date_of_occurrence, 
        posts.state, 
        posts.city, 
        posts.place, 
        posts.post_date,
        citizen_registration.full_name AS post_creator_full_name
    FROM 
        posts
    INNER JOIN
        citizen_registration -- Join to get the post creator's full name
    ON 
        posts.citizen_id = citizen_registration.id
    ORDER BY 
        posts.post_date DESC;
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            throw err;
        }

        res.status(200).json(results);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// New route to fetch problem counts by category
// Route to fetch problem counts by category with optional filters (state, city)
app.get('/fetch_problem_counts', (req, res) => {
    const { state, city } = req.query;

    let query = `
        SELECT category, COUNT(*) AS problem_count 
        FROM posts
    `;
    
    // Add filtering conditions based on the query parameters
    const conditions = [];
    if (state) conditions.push(`state = '${state}'`);
    if (city) conditions.push(`city = '${city}'`);

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` GROUP BY category`;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching problem counts:', err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});
// Route to get distinct states and cities where posts are available
app.get('/fetch_states_cities', (req, res) => {
    const query = `
        SELECT DISTINCT state, city
        FROM posts
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching states and cities:', err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});
