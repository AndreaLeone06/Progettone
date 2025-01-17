import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrimeReportService {
  private apiUrl = 'http://localhost:5000/api/ins';

  constructor(private http: HttpClient) {}

  reportCrime(crimeData: any): Observable<any> {
    return this.http.post(this.apiUrl, crimeData);
  }
}
