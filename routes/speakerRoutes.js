const express = require('express');
const router = express.Router();
const speakerController = require('../controllers/speakerController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /speakers/profile:
 *   post:
 *     summary: Create or update the speaker's profile.
 *     tags:
 *       - Speaker
 *     security:
 *       - bearerAuth: []
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
 *               expertise:
 *                 type: string
 *               pricePerSession:
 *                 type: number
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Invalid user type)
 */


router.post('/profile', authMiddleware, authorize('SPEAKER'), speakerController.createSpeakerProfile);
router.put('/profile', authMiddleware, authorize('SPEAKER'), speakerController.updateSpeakerProfile);

module.exports = router;
