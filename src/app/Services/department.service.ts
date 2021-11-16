import { Injectable } from '@angular/core';
import { Department } from './../Classes/department';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  url = `https://localhost:44341/api/Department/`;
  constructor(private http:HttpClient) { }
  getAllDepartment(): Observable<Department[]> {
    return this.http.get<Department[]>(this.url);
  }
  getDepartmentById(departmentId: string): Observable<Department> {  
    return this.http.get<Department>(this.url + departmentId + '?departmentId=' + departmentId);  
  }
  createDepartment(department: Department): Observable<Department> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Department>(this.url,
      department, httpOptions);
  }
  updateDepartment(department: Department): Observable<Department> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return this.http.put<Department>(this.url + department.departmentId,
      department, httpOptions);
  }
  deleteDepartmentById(departmentId: string): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<number>(this.url +  departmentId,
      httpOptions);
  }

  getdepartment(): Observable<Department[]> {
    return this.http.get<Department[]>('https://localhost:44341/api/department');
  }
}
