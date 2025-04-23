const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Secret key for JWT
const SECRET_KEY = process.env.JWT_SECRET;

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || typeof authHeader !== 'string') {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const parts = authHeader.trim().split(' ');
    if (parts.length !== 2) {
        return res.status(401).json({ message: 'Invalid authorization header format' });
    }

    const token = parts[1];

    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token verification failed', error: err.message });
        }

        const userEmail = decoded.email;

        try {
            const user = await User.findOne({ email: userEmail });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (user.token !== token) {
                return res.status(401).json({ message: 'Token has been invalidated' });
            }

            req.user = { email: userEmail };
            next();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error checking token in database', error: err.message });
        }
    });
}

module.exports = authenticateToken;
