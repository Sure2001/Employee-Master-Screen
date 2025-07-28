import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {
  @Output() selectedEmployeeChange = new EventEmitter<Employee | null>();

  employees: Employee[] = [];
  paginatedEmployees: Employee[] = [];

  selectedEmployees: Employee[] = [];
  selectAll: boolean = false;

  // Pagination
  pageSize = 5;
  currentPage = 1;
  totalPages = 0;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  /** Initial fetch from backend */
  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: data => {
        // Optional: sort in descending order by created time or ID
        this.employees = data.reverse(); // descending
        this.totalPages = Math.ceil(this.employees.length / this.pageSize);
        this.currentPage = 1;
        this.updatePaginatedEmployees();
        this.resetSelection();
      },
      error: err => console.error('Error loading employees', err)
    });
  }

  /** Add newly saved employee directly to the list */
  addEmployeeToList(emp: Employee): void {
    this.employees.unshift(emp); // add to top
    this.totalPages = Math.ceil(this.employees.length / this.pageSize);
    this.currentPage = 1;
    this.updatePaginatedEmployees();
    this.resetSelection();
  }

  /** Slice for pagination */
  updatePaginatedEmployees(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedEmployees = this.employees.slice(startIndex, endIndex);
  }

  /** Previous page button */
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedEmployees();
      this.resetSelection();
    }
  }

  /** Next page button */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedEmployees();
      this.resetSelection();
    }
  }

  /** Select/Deselect all rows */
  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectAll = checked;
    this.selectedEmployees = checked ? [...this.paginatedEmployees] : [];
    this.emitSelectedEmployee();
  }

  /** Individual checkbox selection */
  toggleRowSelection(emp: Employee, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedEmployees.push(emp);
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(e => e._id !== emp._id);
      this.selectAll = false;
    }
    this.emitSelectedEmployee();
  }

  /** Emit selected employee (if only one) to parent */
  emitSelectedEmployee(): void {
    const selected = this.selectedEmployees.length === 1 ? this.selectedEmployees[0] : null;
    this.selectedEmployeeChange.emit(selected);
  }

  /** Reset selection and checkboxes */
  resetSelection(): void {
    this.selectAll = false;
    this.selectedEmployees = [];
    this.emitSelectedEmployee();
  }

  /** Delete selected employee */
  deleteSelected(): void {
    if (this.selectedEmployees.length === 1) {
      const id = this.selectedEmployees[0]._id!;
      if (confirm('Are you sure you want to delete this employee?')) {
        this.employeeService.deleteEmployee(id).subscribe({
          next: () => {
            alert('Employee deleted successfully.');
            // Remove from local list without reload
            this.employees = this.employees.filter(emp => emp._id !== id);
            this.totalPages = Math.ceil(this.employees.length / this.pageSize);
            if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
            this.updatePaginatedEmployees();
            this.resetSelection();
          },
          error: err => {
            console.error('Delete failed', err);
            alert('Failed to delete employee.');
          }
        });
      }
    } else {
      alert('Please select exactly one employee to delete.');
    }
  }
}
