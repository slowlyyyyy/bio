import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CredentialsComponent } from './credentials/credentials.component';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  {
    path: '', component: CredentialsComponent
  },
  {
    path: 'form', component: FormComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
