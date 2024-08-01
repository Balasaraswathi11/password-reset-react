import express from 'express';
import { userregister,userlogin ,resetPassword} from '../Controller/User.controller.js';
import { forgotPassword } from '../Services/Nodemail.js';



const router = express.Router();

// User Registration
router.post('/register', userregister);

// User Login
router.post('/login', userlogin);

// Password Reset
router.post('/reset-password/:username/:token', resetPassword);

// Forgot Password
router.post('/forgot-password', forgotPassword);

export default router;
