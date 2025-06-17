import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ServiceService } from './service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  vendas:any[] = []
  isLoggedIn = false;
  private email: string | null = null;
  private nome: string | null = null;

  constructor(
    private router: Router,
    private service: ServiceService
  ) {}

  setUser(email: string, nome: string) {
    this.email = email;
    this.nome = nome;
  }

  canActivate(): boolean {

    this.service.getVendas().subscribe((vendas:any) => {
      console.log(vendas.items)

      this.vendas = vendas.items
      
      this.vendas.forEach((vendas:any) => {
      // console.log(vendas.buyer.email)

      if(vendas.buyer.email === this.email){

        this.router.navigate(['/form'], {
          queryParams: { email: this.email, nome: this.nome } 
        })
        this.isLoggedIn = true
      }
    })
    })

    
    if (!this.isLoggedIn) {
      // redireciona para a página inicial ou de login
      this.router.navigate(['/']);
      return false; // bloqueia a rota
    }
    return true; // libera o acesso
  }
}
