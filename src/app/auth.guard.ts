import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ServiceService } from './service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  vendas:any[] = []
  emails:any[] = []
  isLoggedIn = false;
  private email: string | null = null;
  private nome: string | null = null;
  private telefone: string | null = null;
  private empresa: string | null = null;

  constructor(
    private router: Router,
    private service: ServiceService
  ) {}

  setUser(email: string, nome: string, telefone: string, empresa: string) {
    this.email = email;
    this.nome = nome;
    this.telefone = telefone;
    this.empresa = empresa;
  }

  canActivate(): boolean {

    this.service.getVendas().subscribe((vendas:any) => {
      this.vendas = vendas.items
      
      this.vendas.forEach((vendas:any) => {

        if(vendas.buyer.email === this.email){

          this.router.navigate(['/form'], {
            queryParams: { 
              email: this.email, 
              nome: this.nome,
              telefone: this.telefone,
              empresa: this.empresa,
            } 
          })
          this.isLoggedIn = true
        }
      })
    })

    this.service.getEmails().subscribe((emails:any) => {
      this.emails = emails

      this.emails.forEach((element:any) => {

        if(element.email === this.email){

          this.router.navigate(['/form'], {
            queryParams: { 
              email: this.email, 
              nome: this.nome,
              telefone: this.telefone,
              empresa: this.empresa,
            } 
          })
          this.isLoggedIn = true
        }
      })
    })

    
    if (!this.isLoggedIn) {

      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
