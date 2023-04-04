const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  workOrder: {
    type: Schema.Types.ObjectId,
    ref: 'WorkOrder',
    required: true
  },
  technician: {
    type: Schema.Types.ObjectId,
    ref: 'Technician'
  },
  items: [{
    description: String,
    quantity: Number,
    cost: Number
  }],
  totalCost: {
    type: Number,
    required: true
  },
  paid: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
