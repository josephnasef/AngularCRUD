import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../Classes/employee';
import { Department } from '../Classes/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  url = `https://localhost:44341/api/Employee/`;
  constructor(private http: HttpClient) { }
  getAllEmployee(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.url);
  }
  getEmployeeById(employeeId: string): Observable<Employee> {  
    return this.http.get<Employee>(this.url + employeeId + '?employeeId=' + employeeId);  
  }
  createEmployee(employee: Employee): Observable<Employee> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Employee>(this.url,
      employee, httpOptions);
  }
  updateEmployee(employee: Employee): Observable<Employee> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return this.http.put<Employee>(this.url + employee.employeeId,
      employee, httpOptions);
  }
  deleteEmployeeById(employeeid: string): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<number>(this.url +  employeeid,
      httpOptions);
  }

  getdepartment(): Observable<Department[]> {
    return this.http.get<Department[]>('https://localhost:44341/api/department');
  }

  deleteData(user: Employee[]): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<string>(this.url + '/DeleteRecord/', user, httpOptions);
  }
}
