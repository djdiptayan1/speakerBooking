const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const speakerRoutes = require('./routes/speakerRoutes');
const swaggerDocs = require('./swagger');
swaggerDocs(app);


// Routes
app.use('/users', userRoutes);
app.use('/bookings', bookingRoutes);
app.use('/speakers', speakerRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
