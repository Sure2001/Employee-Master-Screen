import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'; // ✅ Make sure this is imported
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmployeeMasterComponent } from './employee-master/employee-master.component'; // Your component

@NgModule({
  declarations: [
    AppComponent,
    EmployeeMasterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,      // ✅ Import this
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
