import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const registerUser = async (req, res) => {
    try {
        console.log("Register attempt - Request body:", req.body);
        console.log("Register attempt - Content-Type:", req.get('Content-Type'));

        // Input validation
        if (!req.body || !req.body.fullName || !req.body.email || !req.body.password) {
            console.log("Register validation failed - missing required fields");
            return res.status(400).json({ 
                message: "Full name, email, and password are required",
                received: {
                    hasFullName: !!req.body?.fullName,
                    hasEmail: !!req.body?.email,
                    hasPassword: !!req.body?.password
                }
            });
        }

        const { fullName: { firstName, lastName }, email, password } = req.body;

        if (!firstName || !lastName) {
            console.log("Register validation failed - missing first/last name");
            return res.status(400).json({ 
                message: "First name and last name are required",
                received: { firstName: !!firstName, lastName: !!lastName }
            });
        }

        if (!email.includes('@')) {
            console.log("Register validation failed - invalid email format:", email);
            return res.status(400).json({ message: "Invalid email format" });
        }

        console.log("Checking for existing user with email:", email);
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            console.log("User already exists with email:", email);
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            fullName: {
                firstName,
                lastName
            },
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Set cookie with production-ready configuration
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Allow cross-site cookies in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            path: '/'
        };

        res.cookie("token", token, cookieOptions);
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
            },
        });

    } catch (error) {
        console.error("Error registering user:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            requestBody: req.body
        });
        res.status(500).json({ 
            message: "Server error", 
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
}

export const loginUser = async (req, res) => {
    try {
        console.log("Login attempt - Request body:", req.body);
        console.log("Login attempt - Content-Type:", req.get('Content-Type'));
        
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            console.log("Login validation failed - missing email or password");
            return res.status(400).json({ 
                message: "Email and password are required",
                received: { email: !!email, password: !!password }
            });
        }

        if (!email.includes('@')) {
            console.log("Login validation failed - invalid email format:", email);
            return res.status(400).json({ message: "Invalid email format" });
        }

        console.log("Looking for user with email:", email);
        const user = await userModel.findOne({ email });
        if(!user) {
            console.log("User not found for email:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        console.log("User found, checking password...");
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Invalid password for user:", email);
            return res.status(400).json({ message: "Invalid email or password" });
        }
        console.log("Login successful for user:", email);
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Set cookie with production-ready configuration
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Allow cross-site cookies in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            path: '/'
        };

        console.log("Setting cookie with options:", cookieOptions);
        res.cookie("token", token, cookieOptions);
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
        });



    } catch(error) {
        console.error("Error logging in user:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            requestBody: req.body
        });
        res.status(500).json({ 
            message: "Server error", 
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }

}

export const logoutUser = (req, res) => {
    // Clear cookie with same options used when setting
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
    };
    
    res.clearCookie("token", cookieOptions);
    res.status(200).json({ message: "Logout successful" });
}

export const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Server error" });
    }
}