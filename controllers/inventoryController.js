// const Inventory = require('../models/inventoryModel');

// exports.getAllInventory = async (req, res) => {
//   try {
//     const inventory = await Inventory.find();
//     res.json(inventory);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.getInventoryById = async (req, res) => {
//   try {
//     const inventory = await Inventory.findById(req.params.id);
//     if (inventory) {
//       res.json(inventory);
//     } else {
//       res.status(404).json({ message: 'Inventory item not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.createInventory = async (req, res) => {
//   const inventory = new Inventory({
//     item: req.body.item,
//     quantity: req.body.quantity,
//     cost: req.body.cost
//   });

//   try {
//     const newInventory = await inventory.save();
//     res.status(201).json(newInventory);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// exports.updateInventory = async (req, res) => {
//   try {
//     const inventory = await Inventory.findById(req.params.id);
//     if (inventory) {
//       inventory.item = req.body.item || inventory.item;
//       inventory.quantity = req.body.quantity || inventory.quantity;
//       inventory.cost = req.body.cost || inventory.cost;

//       const updatedInventory = await inventory.save();
//       res.json(updatedInventory);
//     } else {
//       res.status(404).json({ message: 'Inventory item not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.deleteInventory = async (req, res) => {
//   try {
//     const inventory = await Inventory.findById(req.params.id);
//     if (inventory) {
//       await inventory.remove();
//       res.json({ message: 'Inventory item deleted' });
//     } else {
//       res.status(404).json({ message: 'Inventory item not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
