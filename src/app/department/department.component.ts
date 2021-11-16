import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { DepartmentService } from './../Services/department.service';
import { Department } from '../Classes/department';



// tslint:disable-next-line:class-name
interface department {
  departmentId: string;
  departmentName: string;
}

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  dataSaved = false;
  departmentForm: any;
  alldepartments: Observable<department[]>;
  dataSource: MatTableDataSource<department>;
  selection = new SelectionModel<department>(true, []);
  departmentIdUpdate = null;
  massage = null;
  alldepartment: department[];
  departmentId = null;
  SelectedDate = null;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = [ 'departmentName', 'totalEmployees', 'Edit', 'Delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private formbulider: FormBuilder, private departmentService: DepartmentService, private _snackBar: MatSnackBar, public dialog: MatDialog) {
    this.departmentService.getAllDepartment().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnInit() {
    this.departmentForm = this.formbulider.group({
      departmentName: ['', [Validators.required]],
      totalEmployees: ['', [Validators.required]],      
    });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = !!this.dataSource && this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(r => this.selection.select(r));
  }

  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadAlldepartments() {
    this.departmentService.getAllDepartment().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  
  onFormSubmit() {
    this.dataSaved = false;
    const department = this.departmentForm.value;
    this.CreateDepartment(department);
    this.departmentForm.reset();
  }

  loaddepartmentToEdit(departmentId: string) {
    this.departmentService.getDepartmentById(departmentId).subscribe(department => {
      this.massage = null;
      this.dataSaved = false;
      this.departmentIdUpdate = department.departmentId;
      this.departmentForm.controls['departmentName'].setValue(department.departmentName);
      this.departmentForm.controls['totalEmployees'].setValue(department.totalEmployees);

      console.log(department.departmentId);
      this.departmentId = department.departmentId;
    });

  }

  CreateDepartment(department: Department) {
    console.log(department.departmentName);
    console.log(department.departmentId);
    console.log(department);
    if (this.departmentIdUpdate == null) {
      //employee.departmentId = this.departmentId;


      this.departmentService.createDepartment(department).subscribe(
        () => {
          this.dataSaved = true;
          this.SavedSuccessful(1);
          this.loadAlldepartments();
          this.departmentIdUpdate = null;
          this.departmentForm.reset();
        }
      );
    } else {
      department.departmentId = this.departmentIdUpdate;
      //employee.departmentId = this.departmentId;

      this.departmentService.updateDepartment(department).subscribe(() => {
        this.dataSaved = true;
        this.SavedSuccessful(0);
        this.loadAlldepartments();
        this.departmentIdUpdate = null;
        this.departmentForm.reset();
      });
    }
  }
  deleteEmployee(employeeId: string) {
    if (confirm("Are you sure you want to delete this ?")) {
      this.departmentService.deleteDepartmentById(employeeId).subscribe(() => {
        this.dataSaved = true;
        this.SavedSuccessful(2);
        this.loadAlldepartments();
        this.departmentIdUpdate = null;
        this.departmentForm.reset();

      });
    }

  }

  // tslint:disable-next-line:typedef
  FilldepartmentDDL() {
    // tslint:disable-next-line:max-line-length
    //  this.alldepartment =
    this.departmentService.getdepartment().subscribe(data => this.alldepartment  = data as department[]);

  }


  resetForm() {
    this.departmentForm.reset();
    this.massage = null;
    this.dataSaved = false;
    this.loadAlldepartments();
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
