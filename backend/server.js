require('dotenv').config();
const db = require('./database/database');
const apiRoutes = require('./api');
const express = require('express');

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send("Backend running");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));