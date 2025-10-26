// backend/index.js (partie init)
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());
app.use(require('cors')());

connectDB();
// ... routes attachées plus tard
app.listen(process.env.PORT || 5000, ()=> console.log('Server started'));
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/users', require('./routes/users'));

