import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-crime-report',
  templateUrl: './crime-report.component.html',
  styleUrls: ['./crime-report.component.css']
})
export class CrimeReportComponent implements OnInit {
  reportForm: FormGroup;
  message: string | null = null;
  map!: L.Map;
  marker!: L.Marker;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.reportForm = this.fb.group({
      utente: this.fb.group({
        id: ['', Validators.required],
        nome: ['', Validators.required],
        cognome: ['', Validators.required],
        data_nascita: ['', Validators.required],
      }),
      dove: ['', Validators.required],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      tipo_di_crimine: ['', Validators.required],
      geometry: this.fb.group({
        coordinates: ['', Validators.required]
      })
    });
  }

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map').setView([41.9028, 12.4964], 13); // Inizializza la mappa su Roma

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }

      // Aggiorna il form con le coordinate
      this.reportForm.get('geometry.coordinates')?.setValue([lng, lat]);
    });
  }

  submitReport() {
    const reportData = this.reportForm.value;

    this.http.post('http://localhost:5000/api/ins', reportData).subscribe({
      next: (response: any) => {
        this.message = 'Crime data inserted successfully!';
        this.reportForm.reset();
        if (this.marker) this.map.removeLayer(this.marker);
      },
      error: (error) => {
        this.message = `Error: ${error.error.error || 'Failed to submit report.'}`;
      }
    });
  }
}
