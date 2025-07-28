import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';

declare var bootstrap: any; // Needed to control modal dynamically

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent implements OnInit {
  @Output() selectedEmployeeChange = new EventEmitter<Employee | null>();

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  paginatedEmployees: Employee[] = [];

  selectedEmployees: Employee[] = [];
  selectAll: boolean = false;

  // Search/Filter inputs
  searchTerm: string = '';
  filterDepartment: string = '';
  filterStatus: string = '';
  filterHireDate: string = '';
  maxDate = new Date().toISOString().split('T')[0];

  // Pagination
  pageSize = 5;
  currentPage = 1;
  totalPages = 0;

  // Toast & Modal Logic
  toastMessage = '';
  toastType: 'success' | 'danger' = 'success';
  deleteId: string | null = null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data.reverse();
        this.applyFilters();
      },
      error: (err) => console.error('Error loading employees', err),
    });
  }

  addEmployeeToList(emp: Employee): void {
    this.employees.unshift(emp);
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.employees;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.employeeId?.toLowerCase().includes(term) ||
          emp.firstName?.toLowerCase().includes(term) ||
          emp.lastName?.toLowerCase().includes(term)
      );
    }

    if (this.filterDepartment) {
      filtered = filtered.filter((emp) => emp.department === this.filterDepartment);
    }

    if (this.filterStatus) {
      filtered = filtered.filter((emp) => emp.employeeStatus === this.filterStatus);
    }

    if (this.filterHireDate) {
      filtered = filtered.filter((emp) => emp.hireDate?.startsWith(this.filterHireDate));
    }

    this.filteredEmployees = filtered;
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages || 1;
    this.updatePaginatedEmployees();
    this.resetSelection();
  }

  updatePaginatedEmployees(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedEmployees = this.filteredEmployees.slice(startIndex, endIndex);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedEmployees();
      this.resetSelection();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedEmployees();
      this.resetSelection();
    }
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectAll = checked;
    this.selectedEmployees = checked ? [...this.paginatedEmployees] : [];
    this.emitSelectedEmployee();
  }

  toggleRowSelection(emp: Employee, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedEmployees.push(emp);
    } else {
      this.selectedEmployees = this.selectedEmployees.filter((e) => e._id !== emp._id);
      this.selectAll = false;
    }
    this.emitSelectedEmployee();
  }

  emitSelectedEmployee(): void {
    const selected = this.selectedEmployees.length === 1 ? this.selectedEmployees[0] : null;
    this.selectedEmployeeChange.emit(selected);
  }

  resetSelection(): void {
    this.selectAll = false;
    this.selectedEmployees = [];
    this.emitSelectedEmployee();
  }

  /** ✅ Replace alert/confirm with modal & toast */
  deleteSelected(): void {
    if (this.selectedEmployees.length === 1) {
      const id = this.selectedEmployees[0]._id!;
      this.deleteId = id;

      const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
      modal.show();
    } else {
      this.showToast('Please select exactly one employee to delete.', 'danger');
    }
  }

  confirmDelete(): void {
    if (!this.deleteId) return;

    this.employeeService.deleteEmployee(this.deleteId).subscribe({
      next: () => {
        this.employees = this.employees.filter((emp) => emp._id !== this.deleteId);
        this.applyFilters();
        this.showToast('Employee deleted successfully.', 'success');
        this.deleteId = null;
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.showToast('Failed to delete employee.', 'danger');
      },
    });

    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
    modal.hide();
  }

  /** Toast display */
  showToast(message: string, type: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }
}
