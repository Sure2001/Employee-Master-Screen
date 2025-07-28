import { Component, EventEmitter, OnInit, Output, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/models/employee';

declare var bootstrap: any;

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  @Output() formSaved = new EventEmitter<Employee>();
  employeeForm!: FormGroup;
  isEditMode: boolean = false;
  currentId: string = '';

  // Toast controls
  toastMessage: string = '';
toastType: 'success' | 'danger' | 'warning' = 'success'; // ✅ fixed
@ViewChild('toastRef') toastRef!: ElementRef;


  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      _id: [''],
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

  showToast(message: string, type: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastType = type;

    const toastElement = this.toastRef.nativeElement;
    const bsToast = new bootstrap.Toast(toastElement);
    bsToast.show();
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const empData: Employee = this.employeeForm.value;

      if (this.isEditMode && this.currentId) {
        this.employeeService.updateEmployee(this.currentId, empData).subscribe({
          next: () => {
            this.showToast('Employee updated successfully!', 'success');
            this.resetForm();
            this.formSaved.emit(empData);
          },
          error: (err) => {
            console.error('Error updating employee:', err);
            this.showToast('Error updating employee.', 'danger');
          }
        });
      } else {
        const { _id, ...newEmp } = empData;
        this.employeeService.addEmployee(newEmp as Employee).subscribe({
          next: (savedEmp) => {
            this.showToast('Employee added successfully!', 'success');
            this.resetForm();
            this.formSaved.emit(savedEmp);
          },
          error: (err) => {
            console.error('Error adding employee:', err);
            this.showToast('Error occurred while adding employee.', 'danger');
          }
        });
      }
    } else {
      this.showToast('Please fill all required fields!', 'danger');
    }
  }

  maxDate = new Date().toISOString().split('T')[0];

  editEmployee(emp: Employee): void {
    this.employeeForm.patchValue(emp);
    this.currentId = emp._id!;
    this.isEditMode = true;
  }

  resetForm(): void {
    this.employeeForm.reset();
    this.isEditMode = false;
    this.currentId = '';
  }
}
