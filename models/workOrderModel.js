const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Completed'],
    required: true
  },
  technician: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  }
});

module.exports = mongoose.model('WorkOrder', workOrderSchema);
