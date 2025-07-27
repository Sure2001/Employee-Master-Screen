import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.css']
})
export class EmployeeMasterComponent {
  employeeForm: FormGroup;
  selectedTab: string = 'personal';
  employees: any[] = [];
  currentEmployeeIndex: number | null = null;
  selectedIndices: number[] = [];
  isEditMode = false;
  searchTerm = '';

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.employeeForm = this.fb.group({
      employeeId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      department: ['', Validators.required],
      jobTitle: [''],
      employmentType: [''],
      hireDate: [''],
      employeeStatus: [''],
      supervisor: [''],
      salary: [''],
      payFrequency: [''],
      bankDetails: [''],
      address1: [''],
      address2: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      country: [''],
      emergencyContact: [''],
      notes: ['']
    });
  }

  showMessage(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 3000 });
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.keyCode || event.which);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      this.showMessage('Please fill all required fields correctly.');
      return;
    }

    const data = this.employeeForm.value;
    if (this.currentEmployeeIndex === null) {
      this.employees.push(data);
      this.showMessage('Employee saved successfully!');
    } else {
      this.employees[this.currentEmployeeIndex] = data;
      this.showMessage('Employee updated successfully!');
    }

    this.resetForm();
  }

  resetForm(): void {
    this.employeeForm.reset();
    this.currentEmployeeIndex = null;
    this.isEditMode = false;
    this.selectedTab = 'personal';
    this.selectedIndices = [];
  }

  onCancel(): void {
    this.resetForm();
    this.showMessage('Changes canceled.');
  }

  onEdit(): void {
    if (this.currentEmployeeIndex !== null) {
      const employee = this.employees[this.currentEmployeeIndex];
      this.employeeForm.patchValue(employee);
      this.isEditMode = true;
      this.showMessage('Editing employee...');
    }
  }

  onDelete(): void {
    if (this.selectedIndices.length > 0) {
      if (confirm('Are you sure you want to delete selected employee(s)?')) {
        // Sort indices in reverse to avoid shifting while deleting
        this.selectedIndices.sort((a, b) => b - a).forEach(index => {
          this.employees.splice(index, 1);
        });
        this.resetForm();
        this.showMessage('Selected employee(s) deleted.');
      }
    } else if (this.currentEmployeeIndex !== null) {
      if (confirm('Are you sure you want to delete?')) {
        this.employees.splice(this.currentEmployeeIndex, 1);
        this.resetForm();
        this.showMessage('Employee deleted.');
      }
    }
  }

  selectEmployee(index: number): void {
    this.currentEmployeeIndex = index;
  }

  toggleSelection(index: number): void {
    const selected = this.selectedIndices.includes(index);
    if (selected) {
      this.selectedIndices = this.selectedIndices.filter(i => i !== index);
    } else {
      this.selectedIndices.push(index);
    }
  }

  changeTab(tab: string): void {
    this.selectedTab = tab;
  }

  get filteredEmployees() {
    const term = this.searchTerm.toLowerCase();
    return this.employees.filter(emp =>
      emp.employeeId?.toLowerCase().includes(term) ||
      emp.firstName?.toLowerCase().includes(term) ||
      emp.department?.toLowerCase().includes(term)
    );
  }

  isSelected(index: number): boolean {
    return this.selectedIndices.includes(index);
  }
}
