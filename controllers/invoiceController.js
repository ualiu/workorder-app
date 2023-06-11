const Invoice = require('../models/invoiceModel');

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('workOrder technician');
    res.render('invoices/index.ejs');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('workOrder technician');
    if (invoice) {
      res.json(invoice);
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createInvoice = async (req, res) => {
  const invoice = new Invoice({
    workOrder: req.body.workOrder,
    technician: req.body.technician,
    items: req.body.items,
    totalCost: req.body.totalCost,
    paid: req.body.paid,
    notes: req.body.notes
  });

  try {
    const newInvoice = await invoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (invoice) {
      invoice.workOrder = req.body.workOrder || invoice.workOrder;
      invoice.technician = req.body.technician || invoice.technician;
      invoice.items = req.body.items || invoice.items;
      invoice.totalCost = req.body.totalCost || invoice.totalCost;
      invoice.paid = req.body.paid || invoice.paid;
      invoice.notes = req.body.notes || invoice.notes;

      const updatedInvoice = await invoice.save();
      res.json(updatedInvoice);
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (invoice) {
      await invoice.remove();
      res.json({ message: 'Invoice deleted' });
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
