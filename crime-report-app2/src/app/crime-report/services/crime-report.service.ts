import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrimeReportService {
  private apiUrl = "http://127.0.0.1:5000/api/ins";  // Sostituisci con l'URL della tua API

  constructor(private http: HttpClient) {}

  inviaSegnalazione(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);  // Modifica questa parte secondo le tue necessità
  }
}
