const mongoose = require("mongoose");

const SaleDataSchema = new mongoose.Schema({
  month: String,  // Example: "January"
  purchase: Number, // Purchase amount
  sales: Number,    // Sales amount
});

module.exports = mongoose.model("SaleData", SaleDataSchema);
