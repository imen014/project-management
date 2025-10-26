const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const User = require('../models/User');

// 1️⃣ Obtenir tous les employés affectés à ce manager (Mes employés)
router.get('/team', auth, roleCheck(['manager']), async (req, res) => {
  try {
    const employees = await User.find({ manager: req.user.id })
      .select('_id name email');
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de récupérer les employés du manager' });
  }
});

// 2️⃣ Affecter un employé à ce manager
router.put('/:id/assign', auth, roleCheck(['manager']), async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employé introuvable' });
    if (employee.role !== 'employee') return res.status(400).json({ error: 'Ce n’est pas un employé' });

    employee.manager = req.body.manager; // l'ID du manager connecté
    await employee.save();
    res.json({ message: 'Employé affecté avec succès', employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible d’affecter l’employé' });
  }
});

// 3️⃣ Obtenir tous les employés (peu importe s'ils sont assignés ou non)
router.get('/all-employees', auth, roleCheck(['manager', 'admin']), async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' })
      .populate('manager', '_id name')
      .select('_id name email manager');
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de récupérer tous les employés' });
  }
});

// 4️⃣ Optionnel : Obtenir tous les employés (pour manager seulement) avec manager peuplé
router.get('/', auth, roleCheck(['manager']), async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' })
      .populate('manager', '_id name')
      .select('_id name email manager');
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de récupérer les utilisateurs' });
  }
});

module.exports = router;
