const WorkOrder = require('../models/workOrderModel');
const Customer = require('../models/customerModel')


exports.getWorkOrdersByCustomerId = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);
    const workOrders = await WorkOrder.find({ customerId }).populate('customerId');
    const numOrders = workOrders.length;
    if (numOrders === 0) {
      res.render('workOrders/noOrders', { customer });
    } else {
      res.render('workOrders/index', { customer, workOrders, numOrders });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.displayNewWorkOrderForm = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const customer = await Customer.findById(customerId);
    res.render('workOrders/new', { customerId, customer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.displayEditWorkOrderForm = async (req, res) => {
  try {
    const { id } = req.params;
    const workOrder = await WorkOrder.findById(id);

    if (!workOrder) {
      return res.status(404).json({ message: 'Work Order not found' });
    }

    const customer = await Customer.findById(workOrder.customerId);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.render('workOrders/edit', { workOrder, customer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.showCustomerDetails = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);
    const workOrders = await WorkOrder.find({ customerId }).populate('customerId');
    const numOrders = workOrders.length;

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    } else {
      res.render('workOrders/index', { customer, workOrders, numOrders });
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//


exports.getAllWorkOrders = async (req, res) => {
  try {
    const workOrders = await WorkOrder.find().populate('customer').populate('technician');
    res.json(workOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWorkOrderById = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id).populate('customer').populate('technician');
    if (workOrder) {
      res.json(workOrder);
    } else {
      res.status(404).json({ message: 'Work order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createWorkOrder = async (req, res) => {
  console.log(req.body);
  try {
    const { customerId, title, description, status } = req.body;
    const customer = await Customer.findById(req.params.customerId);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const workOrder = await WorkOrder.create({
      title,
      description,
      status,
      customerId, // use the correct property name
    });

    res.redirect(`/api/workOrders/customers/${customerId}/show`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.updateWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.workOrderId);
    if (workOrder) {
      workOrder.customer = req.body.customer || workOrder.customer;
      workOrder.technician = req.body.technician || workOrder.technician;
      workOrder.description = req.body.description || workOrder.description;
      workOrder.status = req.body.status || workOrder.status;
      workOrder.parts = req.body.parts || workOrder.parts;
      workOrder.notes = req.body.notes || workOrder.notes;

      const updatedWorkOrder = await workOrder.save();
      res.redirect(`/api/workOrders/customers/${req.params.customerId}/show`);
    } else {
      res.status(404).json({ message: 'Work order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id);
    if (workOrder) {
      await workOrder.remove();
      res.json({ message: 'Work order deleted' });
    } else {
      res.status(404).json({ message: 'Work order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
