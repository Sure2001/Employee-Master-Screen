import { Component, ViewChild } from '@angular/core';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { Employee } from 'src/app/models/employee';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.css']
})
export class EmployeeMasterComponent {
  showForm = false;
  selectedEmployee: Employee | null = null;

  @ViewChild(EmployeeFormComponent) formComp!: EmployeeFormComponent;
  @ViewChild(EmployeeListComponent) listComp!: EmployeeListComponent;

  // ADD button clicked
  onAdd() {
    this.showForm = true;
    this.selectedEmployee = null;
    this.formComp?.resetForm();
  }

  // Save button clicked
  onSave() {
    this.formComp?.onSubmit(); // triggers save in form component
  }

  // Cancel button clicked
  onCancel() {
    this.showForm = false;
    this.formComp?.resetForm();
  }

  // Edit button clicked
  onEditClick() {
    if (this.selectedEmployee) {
      this.showForm = true;
      this.formComp?.editEmployee(this.selectedEmployee);
    } else {
      alert('Please select one employee to edit.');
    }
  }

  // Delete button clicked
  onDelete() {
    this.listComp?.deleteSelected();
  }

  // View button clicked
  onView() {
    if (this.selectedEmployee) {
      alert(`Viewing: ${this.selectedEmployee.firstName} ${this.selectedEmployee.lastName}`);
    } else {
      alert('Please select one employee to view.');
    }
  }

  // Called when child emits selected employee
  onEmployeeSelected(emp: Employee | null) {
    this.selectedEmployee = emp;
  }

  // Called when form saves successfully
  onEmployeeSaved(emp: Employee) {
    this.showForm = false;
    this.listComp?.addEmployeeToList(emp); // Add new entry to top
  }
}
