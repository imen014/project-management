// création (manager)
router.post('/', auth, roleCheck(['manager']), async (req,res)=>{
  const task = await Task.create({ ...req.body, assignedBy: req.user.id, status:'assigned' });
  res.json(task);
});

// voir ses tâches (employee)
router.get('/mine', auth, async (req,res)=>{
  const tasks = await Task.find({ assignedTo: req.user.id }).populate('project assignedBy assignedTo');
  res.json(tasks);
});

// changer status
router.put('/:id/status', auth, async (req,res)=>{
  const { status } = req.body;
  const t = await Task.findById(req.params.id);
  if(!t) return res.status(404).json({ msg:'Not found' });
  if(req.user.role !== 'manager' && String(t.assignedTo) !== req.user.id) return res.status(403).json({ msg:'Forbidden' });
  t.status = status;
  await t.save();
  res.json(t);
});

// reassigner
router.put('/:id/reassign', auth, async (req,res)=>{
  const { newAssignee } = req.body;
  const t = await Task.findById(req.params.id);
  if(!t) return res.status(404).json({ msg:'Not found' });
  if(req.user.role !== 'manager' && String(t.assignedTo) !== req.user.id) return res.status(403).json({ msg:'Forbidden' });
  t.assignedTo = newAssignee;
  t.status = 'assigned';
  await t.save();
  res.json(t);
});
