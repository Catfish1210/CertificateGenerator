require('dotenv').config();
const { handleApiError, handleCatchError} = require('./errorHandler');
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
    const { templateId, formData, isDownload } = req.body;
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

        if (!response.ok) {
            const errResponse = await response.json();
            return handleApiError(response.status, errResponse.message, res);
        }

        const data = await response.json();
        res.json({ pdf: data.response });
    } catch (error) {
        res.status(500).json({ error: `Failed to generate certificate: ${error}` });
    }
});


// Fetch a template with matching name and then return the ID: 'Certificate Example' [GET]
router.get('/templates', async (req, res) => {
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/templates?name=Certificate Example&per_page=1`, {
            headers: {
                Authorization: `Bearer ${generateJWT()}`
            }
        });
        
        if (!response.ok) {
            const errResponse = await response.json();
            return handleApiError(response.status, errResponse.message, res);
        }

        const data = await response.json();
        const ID = data.response[0].id;
        if (ID) {
            res.json({ id: ID });
        } else {
            res.status(404).json({ error: "ID for Template with the name 'Certificate Example' not found" });
        }
    } catch (err) {
        handleCatchError(err, res);
    }
});


module.exports = router;