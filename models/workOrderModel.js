const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
  itemType: {
    type: String,
    required: true
  },
  brand: {
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
  cost: {
    type: Number,
    required: true,
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
    this.workOrderNumber = Math.floor(Math.random() * 10000) + 1;
  }
  next();
});

module.exports = mongoose.model('WorkOrder', workOrderSchema);
