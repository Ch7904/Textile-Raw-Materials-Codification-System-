const jwt = require("jsonwebtoken");
const JWT_SECRET = "MynameisEndtoEndYouTubeChannel$#"; // Make sure this matches what you use in token generation

module.exports = function (req, res, next) {
    const authHeader = req.header("Authorization");

    // Step 1: Check if header exists
    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    // Step 2: Strip "Bearer " from token
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader;

    try {
        // Step 3: Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};
