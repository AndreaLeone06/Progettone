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
  message: string = ''; // ✅ Aggiunto per gestire i messaggi di conferma o errore
  rating: number = 0; // ✅ Valore numerico del rating
  stars: number[] = [1, 2, 3, 4, 5]; // Array per generare le stelle

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.initMap();
  }

  initForm(): void {
    this.reportForm = this.fb.group({
      dove: ['', Validators.required],
      rating: [null, [Validators.required, Validators.min(0), Validators.max(5)]],
      tipo_di_crimine: ['', Validators.required],
      descrizione: ['', Validators.required]
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

      this.reportForm.patchValue({ dove: `${lat}, ${lng}` });
    });
  }

  // Funzione per aggiornare il rating con stelle
  setRating(star: number) {
    if (this.rating === star) {
      this.rating = star - 0.5; // Se clicca sulla stessa stella, assegna mezza stella
    } else {
      this.rating = star;
    }
    this.reportForm.patchValue({ rating: this.rating }); // Aggiorna il valore del form
  }

  submitReport(): void {
    if (this.reportForm.valid) {
      console.log('Crime Report:', this.reportForm.value);
      this.message = 'Crime report submitted successfully!';
      alert(this.message);
      this.reportForm.reset();
      this.rating = 0; // Resetta le stelle
      if (this.marker) {
        this.map.removeLayer(this.marker);
        this.marker = undefined!;
      }
    } else {
      this.message = 'Please fill out all required fields.';
      alert(this.message);
    }
  }
}
