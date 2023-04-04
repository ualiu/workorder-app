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
  },
  workOrderNumber: {
    type: Number,
    required: false,
    unique: true
  }
});

workOrderSchema.pre('save', function (next) {
  if (!this.workOrderNumber) {
    this.workOrderNumber = Math.floor(Math.random() * 1000) + 1;
  }
  next();
});

module.exports = mongoose.model('WorkOrder', workOrderSchema);
