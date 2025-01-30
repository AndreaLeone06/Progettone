import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CrimeReportService } from './services/crime-report.service';
import * as L from 'leaflet';  // Importa Leaflet per la mappa

@Component({
  selector: 'app-crime-report',
  templateUrl: './crime-report.component.html',
  styleUrls: ['./crime-report.component.css']
})
export class CrimeReportComponent implements OnInit {
  reportForm!: FormGroup;
  rating: number = 0;
  map: any;
  marker: any;
  clusterGroup: any;  // Aggiungi il gruppo di marker

  constructor(private fb: FormBuilder, private crimeService: CrimeReportService) {}

  ngOnInit() {
    this.reportForm = this.fb.group({
      location: [''],
      rating: [0],
      description: [''],
      crimeType: ['']  // Aggiungi il campo Tipo di Crimine
    });

    // Inizializza la mappa
    this.initMap();
  }

  initMap(): void {
    // Inizializza la mappa **dopo** aver dichiarato il div "map"
    this.map = L.map('map').setView([45.4642, 9.1900], 13);  // Coordinate di Milano

    // Crea un gruppo di marker per il cluster
    this.clusterGroup = L.layerGroup().addTo(this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Imposta l'icona rossa per il marker
    const redIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-red.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });

    // Inizialmente, posiziona il marker su Milano
    this.marker = L.marker([45.4642, 9.1900], { icon: redIcon }).addTo(this.map);

    // Imposta il comportamento del clic sulla mappa
    this.map.on('click', (event: any) => {
      const coords = event.latlng;
      this.marker.setLatLng(coords); // Muovi il marker alla posizione cliccata
      this.reportForm.patchValue({
        location: `${coords.lat}, ${coords.lng}`  // Solo numeri senza prefissi
      });
    });
  }

  setRating(star: number): void {
    this.rating = star;
    this.reportForm.patchValue({ rating: this.rating });
  }

  submitReport() {
    // Prima di inviare i dati, assicurati che ci sia un solo marker
    if (this.marker) {
      // Prepara i dati da inviare al server
      const reportData = {
        location: this.reportForm.value.location,
        description: this.reportForm.value.description,
        crimeType: this.reportForm.value.crimeType,
        rating: this.reportForm.value.rating
      };

      // Invia la segnalazione al servizio
      this.crimeService.inviaSegnalazione(reportData).subscribe({
        next: (response: any) => {
          console.log('Report inviato', response);
          // Aggiungi il marker al cluster dopo aver inviato il report
          const coords = this.reportForm.value.location.split(',').map(Number);
          const redIcon = L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-red.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
          });

          this.clusterGroup.addLayer(L.marker(coords, { icon: redIcon }));
        },
        error: (err: any) => {
          console.error('Errore:', err);
        }
      });
    }
  }
}
