const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAvailableSpeakers = async (req, res) => {
    try {
        // Fetch speakers with their available time slots
        const availableTimeSlots = await prisma.timeSlot.findMany({
            where: { available: true },
            include: {
                Speaker: true, // Include related speaker details
            },
        });

        if (availableTimeSlots.length === 0) {
            return res.json({ message: 'No available speakers at the moment' });
        }

        // Group available time slots by speaker
        const speakers = availableTimeSlots.reduce((result, slot) => {
            const speakerId = slot.speakerId;
            if (!result[speakerId]) {
                result[speakerId] = {
                    id: slot.Speaker.id,
                    name: `${slot.Speaker.firstName} ${slot.Speaker.lastName}`,
                    availableTimeSlots: [],
                };
            }

            result[speakerId].availableTimeSlots.push({
                date: slot.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
                timeSlot: slot.timeSlot,
            });

            return result;
        }, {});

        // Convert grouped speakers to an array
        const response = Object.values(speakers);

        res.json({ message: 'Available speakers fetched successfully', speakers: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching available speakers' });
    }
};