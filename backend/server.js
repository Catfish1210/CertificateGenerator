require('dotenv').config();
const db = require('./database/database');

const express = require('express');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Backend running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));