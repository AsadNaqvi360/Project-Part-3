const mongoose = require('mongoose');

let inventoryModel = mongoose.Schema(
  {
    ItemName: String,
    Supplier: String,
    DateReceived: Date,
    ItemDescription: String,
    Cost: Number,
    Quantity: Number,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
  },
  {
    collection: 'Warehouse_Inventory',
  }
);

module.exports = mongoose.model('Item', inventoryModel);