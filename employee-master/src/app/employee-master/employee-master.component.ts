import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';

interface Employee {
  _id?: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  employmentType: string;
  employeeStatus: string;
  hireDate: string;
}

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.css']
})
export class EmployeeMasterComponent implements OnInit {
  employeeForm!: FormGroup;
  searchForm!: FormGroup;

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  showViewPopup = false;

  departments = ['HR', 'IT', 'Finance', 'Marketing'];
  jobTitles = ['Manager', 'Developer', 'Analyst', 'Designer'];
  employmentTypes = ['Full-Time', 'Part-Time', 'Contract'];
  statuses = ['Active', 'Inactive'];

  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.initForms();
    this.getAllEmployees();

    // Live filter on search field changes
    this.searchForm.valueChanges.subscribe(() => this.applyFilters());
  }

  initForms(): void {
    this.employeeForm = this.fb.group({
      employeeId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      department: ['', Validators.required],
      jobTitle: ['', Validators.required],
      employmentType: ['', Validators.required],
      employeeStatus: ['', Validators.required],
      hireDate: ['', Validators.required]
    });

    this.searchForm = this.fb.group({
      searchId: [''],
      searchName: [''],
      searchDepartment: [''],
      searchStatus: ['']
    });
  }

  getAllEmployees(): void {
    this.employeeService.getEmployees().subscribe((data: Employee[]) => {
      this.employees = data;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const { searchId, searchName, searchDepartment, searchStatus } = this.searchForm.value;

    this.filteredEmployees = this.employees.filter(emp =>
      (!searchId || emp.employeeId.toLowerCase().includes(searchId.toLowerCase())) &&
      (!searchName || `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchName.toLowerCase())) &&
      (!searchDepartment || emp.department === searchDepartment) &&
      (!searchStatus || emp.employeeStatus === searchStatus)
    );
  }

  onSelect(emp: Employee): void {
    this.selectedEmployee = emp;
    this.employeeForm.reset(); // Clear form before selecting
  }

  onNew(): void {
    this.employeeForm.reset();
    this.selectedEmployee = null;
  }

  onEdit(): void {
    if (this.selectedEmployee) {
      this.employeeForm.patchValue(this.selectedEmployee);
    }
  }

  onSave(): void {
    if (this.employeeForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const employeeData: Employee = this.employeeForm.value;

    if (this.selectedEmployee && this.selectedEmployee._id) {
      // Update
      this.employeeService.updateEmployee(this.selectedEmployee._id, employeeData).subscribe(() => {
        this.getAllEmployees();
        this.resetFormState();
      });
    } else {
      // Add New
      this.employeeService.addEmployee(employeeData).subscribe(() => {
        this.getAllEmployees();
        this.resetFormState();
      });
    }
  }

  onDelete(): void {
    if (this.selectedEmployee && this.selectedEmployee._id && confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(this.selectedEmployee._id).subscribe(() => {
        this.getAllEmployees();
        this.resetFormState();
      });
    }
  }

  onCancel(): void {
    this.resetFormState();
  }

  onView(): void {
    if (this.selectedEmployee) {
      this.showViewPopup = true;
    }
  }

  closePopup(): void {
    this.showViewPopup = false;
  }

  private resetFormState(): void {
    this.employeeForm.reset();
    this.selectedEmployee = null;
    this.showViewPopup = false;
  }
}
