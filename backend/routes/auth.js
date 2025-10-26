const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req,res)=>{
  const { name, email, password, role } = req.body;
  let u = await User.findOne({ email });
  if(u) return res.status(400).json({ msg: 'User exists' });
  const hashed = await bcrypt.hash(password, 10);
  u = await User.create({ name, email, password: hashed, role });
  const token = jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: u._id, name: u.name, email: u.email, role: u.role } });
});

router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if(!u) return res.status(400).json({ msg: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, u.password);
  if(!ok) return res.status(400).json({ msg: 'Invalid credentials' });
  const token = jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: u._id, name: u.name, email: u.email, role: u.role } });
});

module.exports = router;
