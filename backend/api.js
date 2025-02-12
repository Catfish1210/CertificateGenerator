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

// Fetch template data fields with templateID
router.get("/templates/form/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/templates/${id}/data`, {
            headers: {
                Authorization: `Bearer ${generateJWT()}`
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch formData for template ${id}`);
        }
        
        const data = await response.json();
        res.json({ formData: data.response || {} });
    } catch (err) {
        console.error(`Failed to fetch formData for template ${id}:`, err);
        return {}
    }
})

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