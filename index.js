require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const connectDB = require('./app.js');
const User = require('./User');

const app = express();

app.use(express.json());

connectDB();

const SECRET_KEY = process.env.JWT_SECRET;

app.get("/", (req, res) => res.send("Hello World!"));

const activeTokens = new Map();

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

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });

        user.token = token;

        await user.save();

        res.json({ token });
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
});

app.post('/api/auth/logout', authenticateToken, async (req, res) => {
    const userEmail = req.user.email;

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.token = null;

        await user.save();

        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error("Error logging out user:", err);
        res.status(500).json({ message: 'Error logging out', error: err.message });
    }
});

app.get('/api/users/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password, ...userWithoutPassword } = user.toObject();

        res.json(userWithoutPassword);
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: 'Error fetching user data', error: err.message });
    }
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));
