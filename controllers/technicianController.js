const Technician = require('../models/technicianModel');

exports.getAllTechnicians = async (req, res) => {
  try {
    const technicians = await Technician.find();
    res.json(technicians);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTechnicianById = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);
    if (technician) {
      res.json(technician);
    } else {
      res.status(404).json({ message: 'Technician not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTechnician = async (req, res) => {
  const technician = new Technician({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    notes: req.body.notes
  });

  try {
    const newTechnician = await technician.save();
    res.status(201).json(newTechnician);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTechnician = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);
    if (technician) {
      technician.name = req.body.name || technician.name;
      technician.phone = req.body.phone || technician.phone;
      technician.email = req.body.email || technician.email;
      technician.notes = req.body.notes || technician.notes;

      const updatedTechnician = await technician.save();
      res.json(updatedTechnician);
    } else {
      res.status(404).json({ message: 'Technician not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTechnician = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);
    if (technician) {
      await technician.remove();
      res.json({ message: 'Technician deleted' });
    } else {
      res.status(404).json({ message: 'Technician not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
