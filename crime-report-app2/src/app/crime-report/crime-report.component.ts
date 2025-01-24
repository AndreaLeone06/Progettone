import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-crime-report',
  templateUrl: './crime-report.component.html',
  styleUrls: ['./crime-report.component.css']
})
export class CrimeReportComponent implements OnInit {
  map!: L.Map;
  marker!: L.Marker;
  reportForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm(); // Inizializza il form
    this.initMap();  // Inizializza la mappa
  }

  initForm(): void {
    this.reportForm = this.fb.group({
      dove: ['', Validators.required],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      tipo_di_crimine: ['', Validators.required]
    });
  }

  initMap(): void {
    this.map = L.map('map').setView([41.9028, 12.4964], 13); // Roma come centro predefinito

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          }),
        }).addTo(this.map);
      }

      // Aggiorna il valore del campo 'dove' con la posizione selezionata
      this.reportForm.patchValue({ dove: `${lat}, ${lng}` });
    });
  }

  submitReport(): void {
    if (this.reportForm.valid) {
      console.log('Crime Report:', this.reportForm.value);
      alert('Crime report submitted successfully!');
      this.reportForm.reset();
      if (this.marker) {
        this.map.removeLayer(this.marker);
        this.marker = undefined!;
      }
    } else {
      alert('Please fill out all required fields.');
    }
  }
}
