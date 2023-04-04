const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const technicianSchema = new Schema({
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
  notes: {
    type: String,
    default: ''
  }
});

const Technician = mongoose.model('Technician', technicianSchema);

module.exports = Technician;
