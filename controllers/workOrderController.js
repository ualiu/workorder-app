const WorkOrder = require('../models/workOrderModel');
const Customer = require('../models/customerModel')
const moment = require('moment');
const nodemailer = require('nodemailer');


exports.getWorkOrdersByCustomerId = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);
    const workOrders = await WorkOrder.find({ customerId }).populate('customerId');
    const numOrders = workOrders.length;
    if (numOrders === 0) {
      res.render('workOrders/noOrders', { customer });
    } else {
      // Format the date in each work order using moment.js
      workOrders.forEach(order => {
        order.createdAt = moment(order.createdAt).format('MMM D, YYYY');
      });
      res.render('workOrders/index', { customer, workOrders, numOrders, moment });
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
      res.render('workOrders/index', { customer, workOrders, numOrders, moment });
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//


exports.getAllWorkOrders = async (req, res) => {
  try {
    const workOrders = await WorkOrder.find().populate('customer').populate('technician');
    res.render('index', { workOrders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWorkOrderById = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id);
    if (workOrder) {
      const customer = await Customer.findById(workOrder.customerId);
      //redirect to show.ejs page and populate WO details in a table
      res.render('workOrders/show', { workOrder, customer });
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
    const { customerId, itemType, brand, description, status, cost } = req.body;
    const customer = await Customer.findById(req.params.customerId);
    const formattedCost = parseFloat(req.body.cost)

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const workOrder = await WorkOrder.create({
      itemType,
      brand,
      description,
      status,
      cost,
      customerId, // use the correct property name
    });

    // send email to customer
    sendMail(customer, workOrder);

    res.redirect(`/api/workOrders/customers/${customerId}/show`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// function to send email to customer
const sendMail = (customer, workOrder) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // send mail with defined transport object
  let info = transporter.sendMail({
    from: process.env.EMAIL_USERNAME, // sender address
    to: customer.email, // list of receivers
    subject: 'New Work Order Created', // Subject line
    html: `
      <h1>New Work Order Created</h1>
      <p>A new work order has been created with the following details:</p>
      <ul>
        <li>Item Type: ${workOrder.itemType}</li>
        <li>Brand: ${workOrder.brand}</li>
        <li>Description: ${workOrder.description}</li>
        <li>Status: ${workOrder.status}</li>
        <li>Cost: ${workOrder.cost}</li>
      </ul>
    ` // html body
  });

  console.log('Message sent: %s', info.messageId);
}



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
      // Send email only when the status is updated to completed
      if (req.body.status === 'Completed') {
        const customer = await Customer.findById(updatedWorkOrder.customerId);
        sendStatusUpdateEmail(customer, updatedWorkOrder);
      }
      res.redirect(`/api/workOrders/customers/${req.params.customerId}/show`);
    } else {
      res.status(404).json({ message: 'Work order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const sendStatusUpdateEmail = async (customer, workOrder) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.EMAIL_USERNAME, // sender address
    to: customer.email, // list of receivers
    subject: 'Work Order Status Update', // Subject line
    html: `
      <h1>Work Order Status Update</h1>
      <p>Hi ${customer.name}, We just wanted to let you know that we've completed the below work-order:</p>
      <ul>
        <li>Work-order #: ${workOrder.workOrderNumber}</li>
        <li>Item Type: ${workOrder.itemType}</li>
        <li>Brand: ${workOrder.brand}</li>
        <li>Description: ${workOrder.description}</li>
        <li>Status: ${workOrder.status}</li>
        <li>Cost: ${workOrder.cost}</li>
      </ul>

      Please stop by anytime Monday - Saturday to pick up your item.
      
      We look forward to seeing you soon.

      KWShoeRepair
    ` // html body
  });

  console.log('Message sent: %s', info.messageId);
}


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
