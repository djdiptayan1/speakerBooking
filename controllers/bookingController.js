const crypto = require('crypto');
const { sendEmail } = require('./emailHelper');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// const { createEvent } = require('./googleCalendar'); // Ensure this function is implemented and tested

exports.bookSession = async (req, res) => {
    const { speakerId, date, timeSlot } = req.body;

    // Ensure req.user is defined (handled by auth middleware)
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    // Validate input
    if (!speakerId || !date || !timeSlot) {
        return res.status(400).json({ message: 'All fields are required: speakerId, date, and timeSlot' });
    }

    try {
        // Find the TimeSlot by speakerId, date, and timeSlot
        const timeSlotRecord = await prisma.timeSlot.findFirst({
            where: {
                speakerId,
                date: new Date(date), // Convert the date to a Date object
                timeSlot: timeSlot,
            },
        });

        if (!timeSlotRecord) {
            return res.status(400).json({ message: 'Time slot not available' });
        }

        // Check if the slot is already booked
        const existingBooking = await prisma.booking.findFirst({
            where: {
                timeSlotId: timeSlotRecord.id, // Use timeSlotId to find bookings
            },
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'Slot already booked' });
        }

        // Generate a unique confirmation token
        const confirmationToken = crypto.randomBytes(32).toString('hex');

        // Create the booking with "pending" status
        const booking = await prisma.booking.create({
            data: {
                userId,
                speakerId,
                timeSlotId: timeSlotRecord.id, // Use timeSlotId from timeSlotRecord
                status: 'pending',
                confirmationToken,
            },
        });

        // Fetch user and speaker details
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const speaker = await prisma.speaker.findUnique({ where: { id: speakerId } });

        if (!user || !speaker) {
            return res.status(404).json({ message: 'User or speaker not found' });
        }

        // Define event details
        const eventDetails = {
            summary: `Session Booking with ${speaker.firstName} ${speaker.lastName}`,
            description: `A session on ${date} at ${timeSlot} with ${speaker.firstName}.`,
            startDateTime: `${date}T${timeSlot}:00+05:30`,
            endDateTime: `${date}T${parseInt(timeSlot) + 1}:00+05:30`,
            attendees: [user.email, speaker.email],
        };

        // Send confirmation email to the speaker
        const confirmationUrl = `${process.env.BASE_URL}/bookings/confirm?token=${confirmationToken}`;
        await sendEmail(
            speaker.email,
            'New Session Booking Confirmation',
            `You have a new session request with ${user.firstName} ${user.lastName} on ${date} at ${timeSlot}.
             Please confirm the session by clicking the link below:
             ${confirmationUrl}`
        );

        // Create a calendar event
        await createEvent(eventDetails);

        res.json({ message: 'Session booked successfully, pending speaker confirmation', booking });
    } catch (error) {
        console.error('Error booking session:', error);
        res.status(500).json({ message: 'An error occurred while booking the session' });
    }
};
