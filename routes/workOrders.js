const express = require('express');
const router = express.Router();
const workOrderController = require('../controllers/workOrderController');

router.get('/:id', workOrderController.getWorkOrderById);
// router.delete('/:id', workOrderController.deleteWorkOrder);
router.get('/customers/:id/work-orders', workOrderController.getWorkOrdersByCustomerId);
router.get('/customers/:customerId/new', workOrderController.displayNewWorkOrderForm);
router.post('/customers/:customerId/create', workOrderController.createWorkOrder)
router.get('/customers/:id/show', workOrderController.showCustomerDetails);

router.get('/:id/edit', workOrderController.displayEditWorkOrderForm);
router.post('/customers/:customerId/workOrders/:workOrderId/edit', workOrderController.updateWorkOrder);

router.get('/', workOrderController.getAllOpenWorkOrders);


module.exports = router;
