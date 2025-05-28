const mysql = require('mysql');
const util = require('util');

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'your_host',
    user: 'your_user',
    password: 'your_password',
    database: 'your_database'
});

// Promisify the query method to use async/await
db.query = util.promisify(db.query);

// Middleware for logging authentication activities
const authLogger = async (req, res, next) => {
    if (req.user) { // Assuming 'user' is set after successful authentication
        const log = {
            userId: req.user.id,
            timestamp: new Date(),
            action: 'LOGIN'
        };

        try {
            await db.query('INSERT INTO auth_logs SET ?', log);
        } catch (err) {
            console.error('Failed to log authentication:', err);
        }
    }
    next();
};

// Middleware for logging access attempts
const accessLogger = async (req, res, next) => {
    const log = {
        method: req.method,
        url: req.url,
        ip: req.ip,
        timestamp: new Date()
    };

    try {
        await db.query('INSERT INTO access_logs SET ?', log);
    } catch (err) {
        console.error('Failed to log access attempt:', err);
    }

    next();
};

// Middleware for logging errors
const errorLogger = async (err, req, res, next) => {
    const log = {
        method: req.method,
        url: req.url,
        ip: req.ip,
        timestamp: new Date(),
        error: err.message,
        stack: err.stack
    };

    try {
        await db.query('INSERT INTO error_logs SET ?', log);
    } catch (err) {
        console.error('Failed to log error:', err);
    }

    // Pass the error to the next middleware
    next(err);
};

module.exports = {
    authLogger,
    accessLogger,
    errorLogger
};
