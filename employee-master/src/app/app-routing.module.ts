import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeMasterComponent } from './employee-master/employee-master.component'; // Make sure path is correct

const routes: Routes = [
  { path: 'employee-master', component: EmployeeMasterComponent },
  { path: '', redirectTo: 'employee-master', pathMatch: 'full' }, // optional default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
