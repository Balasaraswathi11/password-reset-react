import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../Model/User.schema.js';

import dotenv from 'dotenv';

dotenv.config();





const transporter = nodemailer.createTransport({
    service: 'Gmail', // or any email service
    auth: {
        user: process.env.useremail,
        pass: process.env.userpassword // Add your email password or app-specific password here
    }
});

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'If the email is registered, a reset link will be sent' });
        }

        // Generate a new reset token
        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `https://passwordreset-react.netlify.app/reset-password/${user.username}/${token}`;
        
        const mailOptions = {
            from: process.env.useremail,
            to: user.email,
            subject: 'Password Reset',
            text: `You requested a password reset. Please use the following link to reset your password: ${resetUrl}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email' });
            }
            console.log('Email sent: ' + info.response);
            res.status(200).json({ message: 'Password reset link sent to your email account' });
        });

    } catch (error) {
        console.log('Error in forgotPassword:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
