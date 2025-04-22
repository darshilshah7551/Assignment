
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
require('dotenv').config();
const db = require("./app.js");
app.get("/", (req, res) => res.send("Hello World!"));
app.use(express.json());



const SECRET_KEY = "mysecretkey";
const activeTokens = new Map();
const users = [
  { email: "user@example.com", password: "securepassword",id:1, name:"user1" },
  { email: "use1r@example.com", password: "securepassword",id:2, name:"user2" },
  { email: "user2@example.com", password: "securepassword",id:3, name:"user3" },
  { email: "user3@example.com", password: "securepassword" ,id:4, name:"user4"},
  { email: "user4@example.com", password: "securepassword",id:5, name:"user5" },
  { email: "user5@example.com", password: "securepassword",id:6, name:"user6" },
];

   //middle ware to auth
   function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || typeof authHeader !== 'string') {
    return res.status(401).json({ message: 'Authorization header missing' });
    }
    
    const parts = authHeader.trim().split(' ');
    
    
    const token = parts[1];
    
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
    return res.status(403).json({ message: 'Token verification failed', error: err.message });
    }
    
    const userEmail = decoded.email;
    const storedToken = activeTokens.get(userEmail);
    
    if (storedToken !== token) {
    return res.status(401).json({ message: 'Token has been invalidated' });
    }
    
    req.user = { email: userEmail };
    next();
    });
    }


    //   Login-------------------------------------------------------------------------------------------------------
     
    app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.getCollection("users")(u => u.email === email && u.password === password);
    console.log("User:", user);
    
    if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    
    activeTokens.set(user.email, token);
    
    res.json({ token });
    });



    //   Logout-------------------------------------------------------------------------------------------------------
    app.post('/api/auth/logout', authenticateToken, (req, res) => {
    const userEmail = req.user.email;
    
    if (activeTokens.has(userEmail)) {
    activeTokens.delete(userEmail);
    return res.json({ message: 'Successfully logged out' });
    }
    
    res.status(400).json({ message: 'User not logged in' });
    });
    
    //  Authenticated User Info -----------------------------------------------------------------------------------------------
    app.get('/api/users/me', authenticateToken, (req, res) => {
    const user = users.find(u => u.email === req.user.email);
    
    if (!user) {
    return res.status(404).json({ message: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
    });
    
    

app.listen(3000, () => console.log("Example app listening on port 3000!"));
