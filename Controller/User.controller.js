import User from "../Model/User.schema.js";
import bcrypt from "bcryptjs";
import express from "express"


// User Registration
export const userregister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ message: "Email already registered" });
        }

        // Hash the password
        const hashpassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newuser = new User({
            username,
            email,
            password: hashpassword
        });
        await newuser.save();

        res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Registration failed", error });
    }
};

// User Login
export const userlogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Email not found" });
        }

        // Compare the provided password with the stored hashed password
        const passwordcompare = await bcrypt.compare(password, user.password);
        if (!passwordcompare) {
            return res.status(401).json({ message: "Invalid password" });
        }
       

        res.status(200).json({ message: "Logged in successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Login failed", error });
    }
};

// Password Reset



export const resetPassword = async (req, res) => {
    try {
        const { username, token } = req.params;
        const { password } = req.body;

        if (!username || !token || !password) {
            return res.status(400).json({ message: 'User ID, token, and password are required' });
        }

        const user = await User.findOne({
            username:username,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(401).json({ message: 'Token is invalid or has expired' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.log('Error in resetPassword:', error);
        res.status(500).json({ message: "Password reset failed", error });
    }
};
