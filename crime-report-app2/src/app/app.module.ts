import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CrimeReportComponent } from './crime-report/crime-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CrimeReportService } from './crime-report/services/crime-report.service';

@NgModule({
  declarations: [
    AppComponent,
    CrimeReportComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [CrimeReportService],
  bootstrap: [AppComponent]
})
export class AppModule {}
