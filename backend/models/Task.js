const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['assigned','starting','in_progress','done'], default: 'assigned' },
  startDate: Date,
  deadline: Date
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
