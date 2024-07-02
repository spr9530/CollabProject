const UserInfo = require("../models/UserSchema");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongoose = require('mongoose')
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');


const otpDatabase = {};

const checkUser = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
        if (err) return res.status(403).json({ message: 'Token is not valid' });

        const user = {
            name: userInfo.name,
            email: userInfo.email,
            userName: userInfo.userName,
            rooms: userInfo.rooms,
        }
        res.json(user)
    });
}

const checkUserName = async (req, res) => {
    try {
        const { userName } = req.query;
        if (!userName) {
            return res.status(400).json({ isUnique: false, message: 'Username is required' });
        }

        const user = await UserInfo.findOne({ userName });

        if (user) {
            return res.status(200).json({ isUnique: false });
        } else {
            return res.status(200).json({ isUnique: true });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ isUnique: false, message: 'Internal Server Error' });
    }
}

const addUser = async (req, res) => {
    const { name, username, email, password } = req.body;

    try {
        // Create a new instance of UserInfo model
        const user = new UserInfo({
            name,
            email,
            userName: username,
            password,
        });

        // Save the user to the database
        await user.save();

        // Respond with a success message or data
        res.status(201).json({ message: 'User added successfully', user });
    } catch (error) {
        console.error('Error adding user:', error.message);
        // Handle any errors (e.g., validation error, database error)
        res.status(500).json({ error: 'Failed to add user' });
    }
};

const userLoggin = async (req, res) => {

    const { userName, password } = req.body;

    try {
        const user = await UserInfo.findOne({ userName: userName })
        console.log(user)
        if (user && user.password === password) {
            const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
            res.json({ token, user });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.log(error)
    }
}

const getUserInfo = async (req, res) => {
    const user = req.user;
    if (user) {
        try {
            const userInfo = await UserInfo.findOne({ _id: user.userId }).populate('rooms')
            await UserInfo.populate(userInfo, {
                path: 'rooms.users.userId'
            });

            const Info = {
                _id: userInfo._id,
                name: userInfo.name,
                email: userInfo.email,
                userName: userInfo.userName,
                rooms: userInfo.rooms,
            }
            res.json({ userInfo: Info })
        } catch (error) {
            res.status(500).json({ error })
        }

    }
}

const updateUserInfo = async (req, res) => {

    const user = req.user;
    const data = req.body;
    if (user) {
        try {
            const userInfo = await UserInfo.findOneAndUpdate({ _id: user.userId }, { $set: { rooms: data.rooms } }, { new: true })
            res.json({ userInfo })
        } catch (error) {
            res.json({ error })
        }
    }
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sprashmanhas60@gmail.com', // Replace with your email address
        pass: 'lwgj dnbb qqsb told', // Replace with your email password (consider using environment variables instead)
    },
});

const sendOtp = async (req, res) => {

    const { email } = req.body;
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    otpDatabase[email] = otp;

    const mailOptions = {
        from: 'sprashmanhas60@gmail.com',
        to: email,
        subject: 'Your OTP for Verification',
        text: `Your OTP is: ${otpDatabase[email]}. It will expire in 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Error sending OTP email' });
        } else {
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'OTP sent successfully' });
        }
    });


}

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    console.log(otpDatabase)

    if (otpDatabase[email] && otpDatabase[email] === otp) {
        delete otpDatabase[email];
        res.status(200).json({ verified: true, message: 'OTP verified successfully' });
    } else {

        res.status(400).json({ verified: false, message: 'Invalid OTP' });
    }
}


module.exports = {
    checkUser, addUser, userLoggin, getUserInfo, updateUserInfo, checkUserName, sendOtp, verifyOtp
}