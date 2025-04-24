const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const connection = require('./config/db');

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));  // Allow frontend access
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use('/auth', authRoutes);  // Routes

app.get('/', (req, res) => res.send('CitizenSahayog API Running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
