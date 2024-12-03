const express = require('express');
const router = express.Router();
const Item = require('../model/item'); // Import the Item model

// Display User's Inventory
router.get('/', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login');
  }

  try {
    // Fetch inventory items belonging to the logged-in user
    const items = await Item.find({ user_id: req.user.id });
    res.render('Inventory/list', {
      title: 'Your Warehouse Inventory',
      ItemList: items,
    });
  } catch (err) {
    console.error(err);
    res.render('Inventory/list', {
      title: 'Your Warehouse Inventory',
      ItemList: [],
      error: 'Error fetching your inventory',
    });
  }
});

// GET Route to Render "Add Inventory Item" Page
router.get('/add', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login');
  }

  res.render('Inventory/add', { title: 'Add New Item' });
});

// POST Route to Add New Inventory Item
router.post('/add', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login');
  }

  try {
    // Create a new inventory item associated with the logged-in user
    const newItem = new Item({
      ItemName: req.body.ItemName,
      Supplier: req.body.Supplier,
      DateReceived: req.body.DateReceived,
      ItemDescription: req.body.ItemDescription,
      Cost: req.body.Cost,
      Quantity: req.body.Quantity,
      user_id: req.user.id, // Associate the item with the logged-in user
    });

    await newItem.save();
    res.redirect('/inventory'); // Redirect back to the inventory page
  } catch (err) {
    console.error(err);
    res.render('Inventory/add', {
      title: 'Add New Item',
      error: 'Error adding item to warehouse',
    });
  }
});

// GET Route to Render "Edit Inventory Item" Page
router.get('/edit/:id', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login');
  }

  try {
    const id = req.params.id;
    const item = await Item.findById(id); // Fetch the item by ID
    if (!item) {
      return res.status(404).send('Item not found');
    }

    res.render('Inventory/edit', { title: 'Edit Item', Item: item });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving the item');
  }
});

// POST Route to Process "Edit Inventory Item"
router.post('/edit/:id', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login');
  }

  try {
    const id = req.params.id;
    const updatedItem = {
      ItemName: req.body.ItemName,
      Supplier: req.body.Supplier,
      DateReceived: req.body.DateReceived,
      ItemDescription: req.body.ItemDescription,
      Cost: req.body.Cost,
      Quantity: req.body.Quantity,
    };

    const result = await Item.findByIdAndUpdate(id, updatedItem, { new: true });
    if (!result) {
      return res.status(404).send('Item not found');
    }

    res.redirect('/inventory'); // Redirect back to the inventory page
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating the item');
  }
});

// GET Route to Delete an Inventory Item
router.get('/delete/:id', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login');
  }

  try {
    const id = req.params.id;
    const result = await Item.findByIdAndDelete(id); // Delete the item by ID
    if (!result) {
      return res.status(404).send('Item not found');
    }

    res.redirect('/inventory'); // Redirect back to the inventory page
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting the item');
  }
});

module.exports = router;
