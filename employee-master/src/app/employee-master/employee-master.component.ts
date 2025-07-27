import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.css']
})
export class EmployeeMasterComponent {
  employeeForm: FormGroup;
  selectedTab = 'personal';
  employees: any[] = [];
  currentEmployeeIndex: number | null = null;

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      // Personal Info
      employeeId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: [''],
      gender: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[0-9]{10}$/)]],

      // Employment
      department: [''],
      jobTitle: [''],
      hireDate: [''],

      // Compensation
      salary: ['', [Validators.pattern(/^[0-9]+$/)]],
      payFrequency: [''],

      // Address
      address1: [''],
      address2: [''],
      city: [''],
      state: [''],
      postalCode: [''],

      // Other
      emergencyContact: [''],
      notes: ['']
    });
  }

  changeTab(tab: string) {
    this.selectedTab = tab;
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const data = this.employeeForm.value;
      if (this.currentEmployeeIndex === null) {
        this.employees.push(data);
        alert('Employee added!');
      } else {
        this.employees[this.currentEmployeeIndex] = data;
        alert('Employee updated!');
      }
      this.employeeForm.reset();
      this.currentEmployeeIndex = null;
    }
  }

  onEdit(index: number) {
    this.employeeForm.patchValue(this.employees[index]);
    this.currentEmployeeIndex = index;
    this.selectedTab = 'personal';
  }

  onDelete(index: number) {
    if (confirm('Delete employee?')) {
      this.employees.splice(index, 1);
      if (this.currentEmployeeIndex === index) {
        this.employeeForm.reset();
        this.currentEmployeeIndex = null;
      }
    }
  }

  onCancel() {
    this.employeeForm.reset();
    this.currentEmployeeIndex = null;
  }
}
