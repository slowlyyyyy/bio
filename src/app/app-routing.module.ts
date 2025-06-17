import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CredentialsComponent } from './credentials/credentials.component';
import { FormComponent } from './form/form.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '', component: CredentialsComponent
  },
  {
    path: 'form', component: FormComponent,
    canActivate: [AuthGuard]  // aqui está o bloqueio
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
