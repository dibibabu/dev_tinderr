const express = require('express');
const bodyParser = require('body-parser');
const { authLogger, accessLogger, errorLogger } = require('./loggers');
const app = express();

app.use(bodyParser.json());

// Use the access logger middleware for all routes
app.use(accessLogger);

// Example login route with authentication logger middleware
app.post('/login', async (req, res) => {
    // Dummy authentication logic
    const { username, password } = req.body;

    // Replace with your actual authentication logic
    if (username === 'admin' && password === 'password') {
        req.user = { id: 1, username: 'admin' }; // Mock user object after successful login
        
        // Call the authentication logger middleware
        await authLogger(req, res, () => {});

        res.send('Login successful!');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Your other routes here
// ...

// Use the error logger middleware (should be used after all routes)
app.use(errorLogger);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
