const Customer = require('../models/customerModel');
const WorkOrder = require('../models/workOrderModel');
const moment = require('moment');

exports.getAllCustomers = async (req, res) => {
  try {
    let numOfCustomers = await Customer.countDocuments({})
    let filter = {};
    if (req.query.search) {
      filter = {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
          { phone: { $regex: req.query.search, $options: 'i' } },
        ]
      };
    }
    const customers = await Customer.find(filter);
    res.render('customers/index', { customers, numOfCustomers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCustomerById = async (req, res) => {
  console.log(req.params.id); // Add this line to check the value of the ID parameter
  try {
    const customer = await Customer.findById(req.params.id);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.createCustomer = async (req, res) => {
  try { 
    
    await Customer.create({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
    notes: req.body.notes
  });
    console.log("Post has been added")
    res.status(201).redirect('/api/customers');
  } catch (err) {
    console.log(err);
  }
};

exports.editCustomerForm = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.render('customers/edit', { customer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (customer) {
      customer.name = req.body.name || customer.name;
      customer.phone = req.body.phone || customer.phone;
      customer.email = req.body.email || customer.email;
      customer.address = req.body.address || customer.address;
      customer.notes = req.body.notes || customer.notes;

      const updatedCustomer = await customer.save();
      res.redirect(`/api/customers`);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (customer) {
      await customer.remove();
      res.json({ message: 'Customer deleted' });
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// displays new customer form -- added after
exports.displayNewCustomerForm = (req, res) => {
  res.render('customers/new.ejs');
};
