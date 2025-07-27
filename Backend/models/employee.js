const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  department: String,
  jobTitle: String,
  employmentType: String,
  hireDate: Date,
  employeeStatus: String,
  supervisor: String,
  salary: Number,
  payFrequency: String,
  bankDetails: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  emergencyContact: String,
  notes: String
});

module.exports = mongoose.model('Employee', employeeSchema);
