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

  toastMessage = '';
  toastType: 'success' | 'danger' | 'warning' | 'info' = 'success';
  showToast = false;
  isHtmlToast = false;

  @ViewChild(EmployeeFormComponent) formComp!: EmployeeFormComponent;
  @ViewChild(EmployeeListComponent) listComp!: EmployeeListComponent;

  // ✅ Unified toast popup method
  showPopup(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'success', isHtml: boolean = false) {
    this.toastMessage = message;
    this.toastType = type;
    this.isHtmlToast = isHtml;
    this.showToast = true;

    setTimeout(() => this.showToast = false, 4000); // Auto-hide after 4s
  }

  // ➕ Add
  onAdd() {
    this.showForm = true;
    this.selectedEmployee = null;
    this.formComp?.resetForm();
  }

  // 💾 Save
  onSave() {
    this.formComp?.onSubmit();
  }

  // ❌ Cancel
  onCancel() {
    this.showForm = false;
    this.formComp?.resetForm();
  }

  // ✏️ Edit
  onEditClick() {
    if (this.selectedEmployee) {
      this.showForm = true;
      this.formComp?.editEmployee(this.selectedEmployee);
    } else {
      this.showPopup('Please select one employee to edit.', 'warning');
    }
  }

  // 🗑 Delete
  onDelete() {
    this.listComp?.deleteSelected();
  }

  // 👁 View
  onView() {
    if (this.selectedEmployee) {
      const emp = this.selectedEmployee;
      const message = `
        <strong>Employee Details:</strong><br>
        <b>ID:</b> ${emp.employeeId} <br>
        <b>Name:</b> ${emp.firstName} ${emp.lastName}<br>
        <b>Department:</b> ${emp.department}<br>
        <b>Status:</b> ${emp.employeeStatus}<br>
        <b>Email:</b> ${emp.email}<br>
        <b>Phone:</b> ${emp.phone}<br>
        <b>Hire Date:</b> ${emp.hireDate}
      `;
      this.showPopup(message, 'info', true);
    } else {
      this.showPopup('Please select one employee to view.', 'warning');
    }
  }

  // ⬇ Receive selected employee from list
  onEmployeeSelected(emp: Employee | null) {
    this.selectedEmployee = emp;
  }

  // ✅ Employee saved successfully
  onEmployeeSaved(emp: Employee) {
    this.showForm = false;
    this.listComp?.addEmployeeToList(emp);
    this.showPopup('Employee saved successfully!', 'success');
  }
}
