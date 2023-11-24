const mongoose = require("mongoose");

const standardSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  moduleapp: {
    type: String,
    required: false,
  },
  dataobject: {
    type: String,
    required: false
  },
  options: {
    type: String,
    required: false
  },
});

module.exports = mongoose.model('Standard', standardSchema);
