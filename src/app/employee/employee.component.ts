import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { EmployeeService } from '../Services/employee.service';
import { Employee } from '../Classes/employee';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';



// tslint:disable-next-line:class-name
interface department {
  departmentId: string; 
  departmentName: string;
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

export class EmployeeComponent implements OnInit {
  dataSaved = false;
  employeeForm: any;
  allEmployees: Observable<Employee[]>;
  dataSource: MatTableDataSource<Employee>;
  selection = new SelectionModel<Employee>(true, []);
  employeeIdUpdate = null;
  massage = null;
  alldepartment: department[];
  departmentId = null;  
  SelectedDate = null;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = [ 'employeeName', 'employeeTitle', 'employeeBirthDate', 'employeeHiringDate','departmentName', 'Edit', 'Delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // tslint:disable-next-line:max-line-length
  constructor(private formbulider: FormBuilder, private employeeService: EmployeeService, private _snackBar: MatSnackBar, public dialog: MatDialog) {
    this.employeeService.getAllEmployee().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnInit() {
    this.employeeForm = this.formbulider.group({
      employeeName: ['', [Validators.required]],
      employeeTitle: ['', [Validators.required]],
      employeeBirthDate: ['', [Validators.required]],
      employeeHiringDate: ['', [Validators.required]],
      departmentName: ['', [Validators.required]],
      departmentId: ['', [Validators.required]],
    });
    this.FilldepartmentDDL();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = !!this.dataSource && this.dataSource.data.length;
    return numSelected === numRows;
  }

 /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(r => this.selection.select(r));
  }
  
  
  DeleteData() {
    debugger;
    const numSelected = this.selection.selected;
    if (numSelected.length > 0) {
      if (confirm("Are you sure to delete items ")) {
        this.employeeService.deleteData(numSelected).subscribe(result => {
          this.SavedSuccessful(2);
          this.loadAllEmployees();
        })
      }
    } else {
      alert("Select at least one row");
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadAllEmployees() {
    this.employeeService.getAllEmployee().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  
  onFormSubmit() {
    this.dataSaved = false;
    const employee = this.employeeForm.value;
    this.CreateEmployee(employee);
    this.employeeForm.reset();
  }

  loadEmployeeToEdit(employeeId: string) {
    this.employeeService.getEmployeeById(employeeId).subscribe(employee => {
      this.massage = null;
      this.dataSaved = false;
      this.employeeIdUpdate = employee.employeeId;
      this.employeeForm.controls['employeeName'].setValue(employee.employeeName);
      this.employeeForm.controls['employeeTitle'].setValue(employee.employeeTitle);
      this.employeeForm.controls['employeeBirthDate'].setValue(employee.employeeBirthDate);
      this.employeeForm.controls['employeeHiringDate'].setValue(employee.employeeHiringDate);
      //this.employeeForm.controls['departmentName'].setValue(employee.departmentName);
      this.employeeForm.controls['departmentId'].setValue(employee.departmentId);
      this.employeeForm.controls['departmentName'].setValue(employee.departmentName);
      this.employeeForm.controls['departmentName'].disable();
      console.log(employee.departmentId);

      this.departmentId = employee.departmentId;
    });

  }
  CreateEmployee(employee: Employee) {
    console.log(employee.employeeBirthDate);
    console.log(employee.employeeHiringDate);
    console.log(employee);
    if (this.employeeIdUpdate == null) {
      //employee.departmentId = this.departmentId;


      this.employeeService.createEmployee(employee).subscribe(
        () => {
          this.dataSaved = true;
          this.SavedSuccessful(1);
          this.loadAllEmployees();
          this.employeeIdUpdate = null;
          this.employeeForm.reset();
        }
      );
    } else {
      employee.employeeId = this.employeeIdUpdate;
      //employee.departmentId = this.departmentId;

      this.employeeService.updateEmployee(employee).subscribe(() => {
        this.dataSaved = true;
        this.SavedSuccessful(0);
        this.loadAllEmployees();
        this.employeeIdUpdate = null;
        this.employeeForm.reset();
      });
    }
  }
  deleteEmployee(employeeId: string) {
    if (confirm("Are you sure you want to delete this ?")) {
      this.employeeService.deleteEmployeeById(employeeId).subscribe(() => {
        this.dataSaved = true;
        this.SavedSuccessful(2);
        this.loadAllEmployees();
        this.employeeIdUpdate = null;
        this.employeeForm.reset();

      });
    }

  }

  // tslint:disable-next-line:typedef
  FilldepartmentDDL() {
    // tslint:disable-next-line:max-line-length
    //  this.alldepartment =
    this.employeeService.getdepartment().subscribe(data => this.alldepartment  = data as department[]);

  }


  resetForm() {
    this.employeeForm.reset();
    this.massage = null;
    this.dataSaved = false;
    this.loadAllEmployees();
  }

  SavedSuccessful(isUpdate) {
    if (isUpdate === 0) {
      this._snackBar.open('Record Updated Successfully!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } 
    else if (isUpdate === 1) {
      this._snackBar.open('Record Saved Successfully!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
    else if (isUpdate === 2) {
      this._snackBar.open('Record Deleted Successfully!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
}
