const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

let otpStore = {};  // Store OTPs per email address
let otpTimestampStore = {}; // Store OTP generation timestamps per email

// Constants
const OTP_EXPIRY_TIME = 5 * 60 * 1000;
const OTP_RESEND_TIME = 60 * 1000;
let lastOtpSentTime = null;

// Signup: Create a user and generate OTP for verification
exports.signup = async (req, res) => {
    const { firstName, lastName, email, password, userType, otp } = req.body;

    if (otp !== otpStore[email]) {
        return res.status(401).json({ message: 'Invalid OTP or OTP expired' });
    }

    if (Date.now() - otpTimestampStore[email] > OTP_EXPIRY_TIME) {
        delete otpStore[email];
        delete otpTimestampStore[email];
        return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        if (userType === 'USER') {
            await prisma.user.create({
                data: { firstName, lastName, email, password: hashedPassword },
            });
        } else if (userType === 'SPEAKER') {
            await prisma.speaker.create({
                data: { firstName, lastName, email, password: hashedPassword, expertise: '', pricePerSession: 0 },
            });
        } else {
            return res.status(400).json({ message: 'Invalid userType' });
        }

        delete otpStore[email];
        delete otpTimestampStore[email];
        res.json({ message: 'Signup successful, user verified' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Email already exists' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // First, check the User table
    let user = await prisma.user.findUnique({ where: { email } });

    // If the user isn't found in the User table, check the Speaker table
    if (!user) {
        user = await prisma.speaker.findUnique({ where: { email } });
    }

    // If the user isn't found in either table, return an error
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token after successful login
    const token = jwt.sign({ id: user.id, userType: user.userType || 'SPEAKER' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Login successful', token });
};


// Generate OTP (called separately when requested)
exports.generateOtp = async (req, res) => {
    const { email } = req.body;

    // Check if the current email has been requested recently
    if (
        otpTimestampStore[email] &&
        Date.now() - otpTimestampStore[email] < OTP_RESEND_TIME
    ) {
        return res.status(400).json({ 
            message: 'Please wait 60 seconds before requesting a new OTP for this email' 
        });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store the OTP and timestamp for the specific email
    otpStore[email] = otp;
    otpTimestampStore[email] = Date.now();

    // Log the OTP for testing purposes (replace this with actual email sending in production)
    console.log('Generated OTP for', email, ':', otp);

    res.json({ message: 'OTP generated successfully', otp });
};

const checkOtpExpiry = (req, res, next) => {
    const email = req.body.email;

    if (otpStore[email] && Date.now() - otpTimestampStore[email] > OTP_EXPIRY_TIME) {
        // Invalidate OTP if expired
        delete otpStore[email];
        delete otpTimestampStore[email];
        return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    next();
};
