const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Project = require('../models/Project');

router.post('/', auth, roleCheck(['manager']), async (req,res)=>{
  const p = await Project.create({ ...req.body, manager: req.user.id });
  res.json(p);
});

router.get('/my', auth, async (req,res)=>{
  // managers récupèrent leurs projets ; employés aucune autorité sur créer
  const projects = await Project.find({ manager: req.user.id });
  res.json(projects);
});

module.exports = router;
