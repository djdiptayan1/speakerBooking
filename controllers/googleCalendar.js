const { google } = require('googleapis');
const { readFileSync } = require('fs');

// Load credentials
const credentials = JSON.parse(readFileSync('./google-service-account.json'));

// Create Google Calendar client
const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/calendar']
);

const calendar = google.calendar({ version: 'v3', auth });

/**
 * Create a Google Calendar event
 * @param {Object} eventDetails - Details of the event
 */
exports.createEvent = async (eventDetails) => {
    try {
        const event = {
            summary: eventDetails.summary,
            description: eventDetails.description,
            start: {
                dateTime: eventDetails.startDateTime,
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: eventDetails.endDateTime,
                timeZone: 'Asia/Kolkata',
            },
            attendees: eventDetails.attendees.map((email) => ({ email })),
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });

        return response.data;
    } catch (error) {
        console.error('Error creating Google Calendar event:', error);
        throw error;
    }
};
