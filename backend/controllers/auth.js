const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function Register(req, res) {
    const { userName, prenume, nume, email, parola, preferinteGen } = req.body;

    // Check if all required fields are provided
    if (!userName || !prenume || !nume || !email || !parola || !preferinteGen) {
        return res.status(400).json({
            status: "error",
            message: "All fields are required."
        });
    }

    try {
        // Check for existing user by email and username
        const existingUser = await User.findOne({ 
            $or: [{ email }, { userName }] 
        });

        if (existingUser) {
            return res.status(400).json({
                status: "error",
                message: "User already exists with this email or username"
            });
        }

        // Create new user
        const newUser = new User({ userName, prenume, nume, email, parola, preferinteGen });

        // Save user to database
        const savedUser = await newUser.save();

        // Remove password from response
        const userResponse = {
            _id: savedUser._id,
            userName: savedUser.userName,
            prenume: savedUser.prenume,
            nume: savedUser.nume,
            email: savedUser.email,
            creat: savedUser.creat
        };

        res.status(201).json({
            status: "success",
            data: userResponse,
            message: "User created successfully"
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
}

async function Login(req, res) {
    const { email, parola } = req.body;

    try {
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                status: "error",
                message: "Invalid credentials" 
            });
        }

        // Validate password
        const isMatch = await bcrypt.compare(parola, user.parola);
        if (!isMatch) {
            return res.status(401).json({ 
                status: "error",
                message: "Invalid credentials" 
            });
        }

        // Create JWT
        const token = jwt.sign(
            { id: user._id , isAdmin: user.isAdmin},
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // User data without password
        const userData = {
            _id: user._id,
            userName: user.userName,
            prenume: user.prenume,
            nume: user.nume,
            email: user.email,
            creat: user.creat
        };

        res.status(200).json({
            status: "success",
            token,
            user: userData,
            message: "Logged in successfully"
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
}

function Logout(req, res) {
    // In JWT implementation, logout is client-side (token invalidation)
    res.status(200).json({
        status: "success",
        message: "Logged out successfully. Please remove your token."
    });
}

module.exports = { Register, Login, Logout };