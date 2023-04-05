const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/', customerController.getAllCustomers);
router.get('/new', customerController.displayNewCustomerForm);
router.get('/:id/edit', customerController.editCustomerForm);
router.post('/:id', customerController.updateCustomer);

router.get('/:id', customerController.getCustomerById);
router.post('/', customerController.createCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
