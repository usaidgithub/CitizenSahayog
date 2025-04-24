const bcrypt = require('bcrypt');
const connection = require('../config/db');
const { encrypt } = require('../utils/encryption');

const registerUser = async (req, res) => {
    try {
        const { fullName, dob, gender, mobileNumber, permanentAddress, currentAddress, aadharNumber, panNumber, voterID, email, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const encryptedAadharNumber = encrypt(aadharNumber);
        const encryptedPanNumber = panNumber ? encrypt(panNumber) : null;
        const encryptedVoterID = voterID ? encrypt(voterID) : null;

        const sql = `INSERT INTO citizen_registration 
                    (full_name, dob, gender, mobile_number, permanent_address, current_address, aadhaar_number, pan_number, voter_id, email, username, password) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        connection.query(sql, [fullName, dob, gender, mobileNumber, permanentAddress, currentAddress, encryptedAadharNumber, encryptedPanNumber, encryptedVoterID, email, username, hashedPassword], 
            (err, results) => {
                if (err) {
                    console.error('❌ Registration error:', err);
                    return res.status(500).json({ message: 'Registration failed' });
                }
                res.status(200).json({ message: 'Registration successful' });
            });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = (req, res) => {
    console.log("Handling user login");
    const { username, password } = req.body;

    connection.query('SELECT id, password FROM citizen_registration WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error("❌ Error during login:", err);
            return res.status(500).json({ message: "Server error" });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        req.session.userId = user.id;
        req.session.save(err => {
            if (err) {
                console.error("Session save error", err);
                return res.status(500).json({ message: "Server error" });
            }
            res.status(200).json({ message: "Login successful" });
        });
    });
};

module.exports = { registerUser, loginUser };
