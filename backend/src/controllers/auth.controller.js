import { generateJwt } from "../lib/jwt.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters." });
        }

        const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailregex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {

            generateJwt(newUser._id, res);
            await newUser.save();
            return res.status(200).json({ message: "User created successfully." });

        } else {

            return res.status(400).json({ message: "Invalid User data." });
        }

    } catch (error) {
        console.log("Signup error ", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        generateJwt(user._id, res);
        return res.status(200).json({ message: "User logged in successfully." });

    } catch (error) {
        console.log("Login error ", error);
        return res.status(500).json({ message: "Internal server error." });
    }

}

export const logout = async (req, res) => {

    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "User logged out successfully." });
    } catch (error) {
        console.log("Logout error ", error);
        return res.status(500).json({ message: "Internal server error." });
    }

}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "ProfilePic is required." });
        }
        // upload image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        // update user in database
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

        return res.status(200).json(
            {
                message: "Profile updated.",
                updatedUser
            });

    } catch (error) {
        console.log("UpdateProfile error ", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export const checkAuth = (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.log("CheckAuth error ", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}