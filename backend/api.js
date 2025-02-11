require('dotenv').config();
const express = require('express');
const router = express.Router();

const generateJWT = () => {
    const jwt = require('jsonwebtoken');
    const payload = {
        iss: process.env.API_KEY,
        sub: process.env.WORKSPACE_ID,
        exp: Math.floor(Date.now() / 1000) + 3 // 3 sec
    };
    return jwt.sign(payload, process.env.API_SECRET, { algorithm: 'HS256' });
};

// Fetch list of templates
router.get('/templates', async (req, res) => {
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/templates`, {
            headers: {
                Authorization: `Bearer ${generateJWT()}`
            }
        });
        const data = await response.json();
        console.log(data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch templates" });
    }
});


module.exports = router;