// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // ✅ Add FormsModule
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { EmployeeMasterComponent } from './employee-master/employee-master.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeMasterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,           // ✅ Needed for ngModel
    ReactiveFormsModule,   // ✅ Needed for formGroup, formControlName
    HttpClientModule       // ✅ Needed for service HttpClient
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
