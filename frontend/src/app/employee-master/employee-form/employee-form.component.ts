import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/models/employee';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
@Output() formSaved = new EventEmitter<Employee>();
// ✅ Emits the saved/updated employee

  employeeForm!: FormGroup;
  isEditMode: boolean = false;
  currentId: string = '';

  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.initForm();
  }

  // Initialize form
  initForm(): void {
    this.employeeForm = this.fb.group({
      _id: [''], // Required for update
      employeeId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      gender: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],

     department: ['', Validators.required],
  jobTitle: ['', Validators.required],
  employmentType: ['', Validators.required],
      hireDate: [''],
       employeeStatus: ['', Validators.required],
      supervisor: [''],

      salary: [],
        payFrequency: ['', Validators.required],
      bankAccount: [''],

      address1: [''],
      address2: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      country: [''],

      emergencyContactName: [''],
      emergencyContactNumber: [''],
      notes: ['']
    });
  }

  // Called on Save button
 onSubmit(): void {
  if (this.employeeForm.valid) {
    const empData: Employee = this.employeeForm.value;

    if (this.isEditMode && this.currentId) {
      // 🔁 Edit mode
      this.employeeService.updateEmployee(this.currentId, empData).subscribe({
        next: () => {
          alert('Employee updated successfully!');
          this.resetForm();
          this.formSaved.emit(empData); // ✅ Fixed
        },
        error: (err) => {
          console.error('Error updating employee:', err);
          alert('Error updating employee.');
        }
      });
    } else {
      // ➕ Add mode
      const { _id, ...newEmp } = empData;

      this.employeeService.addEmployee(newEmp as Employee).subscribe({
        next: (savedEmp) => {
          alert('Employee added successfully!');
          this.resetForm();
          this.formSaved.emit(savedEmp); // ✅ Fixed
        },
        error: (err) => {
          console.error('Error adding employee:', err);
          alert('Error occurred!');
        }
      });
    }
  } else {
    alert('Please fill all required fields!');
  }
}


maxDate = new Date().toISOString().split('T')[0]; // Prevent future DOB

  // Set form in edit mode with values
  editEmployee(emp: Employee): void {
    this.employeeForm.patchValue(emp);
    this.currentId = emp._id!;
    this.isEditMode = true;
  }

  // Reset form
  resetForm(): void {
    this.employeeForm.reset();
    this.isEditMode = false;
    this.currentId = '';
  }
}
