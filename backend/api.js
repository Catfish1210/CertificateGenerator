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

// Generate document [POST]
router.post('/documents/generate', async (req, res) => {
    const { templateId, formData } = req.body;
    if(!templateId || !formData) {
        return res.status(400).json({ error: "Missing templateId or formData" });
    }

    try {
        const response = await fetch(`${process.env.API_BASE_URL}/documents/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${generateJWT()}`
            },
            body: JSON.stringify({
                template: {
                    id: parseInt(templateId),
                    data: formData,
                },
                format: "pdf",
                output: "base64",
                testing: true
            })
        });

        const data = await response.json();
        res.json({ pdf: data.response });
    } catch (error) {
        res.status(500).json({ error: `Failed to generate certificate: ${error}` });
    }
});


// Fetch template data fields with templateID [GET]
router.get('/templates/form/:id', async (req, res) => {
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

// Fetch list of templates [GET]
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