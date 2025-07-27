import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { EmployeeMasterComponent } from './employee-master/employee-master.component'; // adjust path if needed

@NgModule({
  declarations: [
    AppComponent,
    EmployeeMasterComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,    // ✅ Required for MatSnackBar animations
    MatSnackBarModule           // ✅ Required for displaying snackbars
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
