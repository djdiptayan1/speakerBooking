const express = require('express');
const router = express.Router();
const { bookSession } = require('../controllers/bookingController');
const { getAvailableSpeakers } = require('../controllers/getSpeakers');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /bookings/book:
 *   post:
 *     summary: Book a session with a speaker.
 *     tags:
 *       - Booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               speakerId:
 *                 type: string
 *               userId:
 *                 type: string
 *               timeSlot:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Session booked successfully
 *       400:
 *         description: Invalid request data
 */
/**
 * @swagger
 * /bookings/speakers:
 *   get:
 *     summary: Get a list of available speakers.
 *     tags:
 *       - Booking
 *     responses:
 *       200:
 *         description: List of available speakers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   expertise:
 *                     type: string
 *                   availability:
 *                     type: boolean
 */


// Routes for booking session
router.post('/book', authMiddleware, bookSession);
router.get('/speakers', authMiddleware, getAvailableSpeakers);

module.exports = router;
