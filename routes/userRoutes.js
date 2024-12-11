const express = require('express');
const router = express.Router();
const { signup, login, generateOtp } = require('../controllers/authController');

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Sign up a new user or speaker.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               userType:
 *                 type: string
 *                 enum: [USER, SPEAKER]
 *               otp:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Signup successful
 *       401:
 *         description: Invalid OTP
 *       400:
 *         description: OTP expired or invalid userType
 */
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login for users and speakers.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
/**
 * @swagger
 * /users/generateOtp:
 *   post:
 *     summary: Generate a one-time password for user verification.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP generated successfully
 *       400:
 *         description: Please wait 60 seconds before requesting a new OTP
 */


// Routes for user signup and login
router.post('/signup', signup);
router.post('/login', login);
router.post('/generateOtp', generateOtp)

module.exports = router;
