const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  workOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkOrder'
    }
  ]
});

module.exports = mongoose.model('Customer', customerSchema);
