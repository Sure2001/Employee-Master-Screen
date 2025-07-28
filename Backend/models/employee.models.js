// backend/models/employee.model.js

const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  department: String,
  email: String,
  phone: String,
  hireDate: Date,
  employeeStatus: String,
  confirmationDate: Date,
  compensation: {
    salary: Number,
    bonus: Number
  },
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    zip: String
  },
  otherInfo: String
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
