import { Component } from '@angular/core';
import { CrimeReportService } from '../crime-report.service';

@Component({
  selector: 'app-crime-form',
  templateUrl: './crime-form.component.html',
  styleUrls: ['./crime-form.component.css']
})
export class CrimeFormComponent {
  crimeData = {
    utente: {
      nome: '',
      cognome: '',
      data_nascita: ''
    },
    dove: '',
    rating: null,
    tipo_di_crimine: '',
    geometry: {
      coordinates: [0, 0]
    }
  };

  constructor(private crimeReportService: CrimeReportService) {}

  submitCrime() {
    this.crimeReportService.reportCrime(this.crimeData).subscribe(
      response => {
        alert('Segnalazione inviata con successo!');
        console.log(response);
      },
      error => {
        alert('Errore durante l\'invio della segnalazione.');
        console.error(error);
      }
    );
  }
}
