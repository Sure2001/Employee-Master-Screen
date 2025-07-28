const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  firstName: String,
  lastName: String,
  dob: Date,
  gender: String,
  email: { type: String, required: true },
  phone: String,

  department: String,
  jobTitle: String,
  employmentType: String,
  hireDate: Date,
  employeeStatus: String,
  supervisor: String,

  salary: Number,
  payFrequency: String,
  bankAccount: String,

  address1: String,
  address2: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,

  emergencyContactName: String,
  emergencyContactNumber: String,
  notes: String
});

module.exports = mongoose.model('Employee', EmployeeSchema);
