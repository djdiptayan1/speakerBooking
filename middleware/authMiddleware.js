const jwt = require('jsonwebtoken');

// Middleware to authenticate the user
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];  // Extract token from Authorization header
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Attach decoded token to request
        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

// Middleware to authorize based on user role
const authorize = (role) => (req, res, next) => {
    if (req.user.userType !== role) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
};


module.exports = { authMiddleware, authorize };
