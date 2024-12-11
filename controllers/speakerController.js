const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createSpeakerProfile = async (req, res) => {
    const { expertise, pricePerSession } = req.body;

    // Ensure the user is logged in and is a Speaker
    if (req.user.userType !== 'SPEAKER') {
        return res.status(403).json({ message: 'Access forbidden: Only speakers can create profiles' });
    }

    try {
        // Check if the speaker profile already exists
        const existingSpeaker = await prisma.speaker.findUnique({ where: { id: req.user.id } });
        if (existingSpeaker) {
            return res.status(400).json({ message: 'Profile already exists' });
        }

        // Create the speaker profile
        const speaker = await prisma.speaker.create({
            data: {
                firstName: req.user.firstName,  // Use logged-in user's first name
                lastName: req.user.lastName,    // Use logged-in user's last name
                email: req.user.email,          // Use logged-in user's email
                password: req.user.password,    // Use logged-in user's password
                expertise,
                pricePerSession,
            },
        });

        // Generate time slots for the speaker for the next year (365 days)
        const timeSlots = [];
        const currentDate = new Date();

        for (let dayOffset = 0; dayOffset < 365; dayOffset++) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() + dayOffset);

            for (let hour = 9; hour <= 16; hour++) {
                const timeSlot = `${hour}:00`;

                timeSlots.push({
                    speakerId: speaker.id,
                    date: date,
                    timeSlot: timeSlot,
                    available: true,
                });
            }
        }

        await prisma.timeSlot.createMany({ data: timeSlots });

        res.json({ message: 'Speaker profile created successfully and time slots added for one year', speaker });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating speaker profile' });
    }
};



exports.listSpeakers = async (req, res) => {
    const speakers = await prisma.speaker.findMany({
        include: { User: true },
    });
    res.json(speakers);
};

exports.updateSpeakerProfile = async (req, res) => {
    const { expertise, pricePerSession } = req.body;

    // Ensure the user is logged in and is a Speaker
    if (req.user.userType !== 'SPEAKER') {
        return res.status(403).json({ message: 'Access forbidden: Only speakers can update profiles' });
    }

    try {
        // Check if the speaker profile already exists
        const existingSpeaker = await prisma.speaker.findUnique({ where: { id: req.user.id } });
        if (!existingSpeaker) {
            return res.status(400).json({ message: 'Speaker profile does not exist' });
        }

        // Update the speaker profile with the new expertise and pricePerSession
        const speaker = await prisma.speaker.update({
            where: { id: req.user.id },
            data: {
                expertise,
                pricePerSession,
            },
        });
        // Generate time slots for the speaker for the next year (365 days)
        const timeSlots = [];
        const currentDate = new Date();

        for (let dayOffset = 0; dayOffset < 365; dayOffset++) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() + dayOffset);

            for (let hour = 9; hour <= 16; hour++) {
                const timeSlot = `${hour}:00`;

                timeSlots.push({
                    speakerId: speaker.id,
                    date: date,
                    timeSlot: timeSlot,
                    available: true,
                });
            }
        }

        await prisma.timeSlot.createMany({ data: timeSlots });
        res.json({ message: 'Speaker profile updated successfully', speaker });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating speaker profile' });
    }
};
