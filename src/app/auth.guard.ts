import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ServiceService } from './service.service';
import { Observable } from 'rxjs';

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

  setUser(email: string, nome: string, telefone: string) {
    this.email = email;
    this.nome = nome;
    this.telefone = telefone;
    this.isLoggedIn = true
  }

  // canActivate(): boolean {

  //   this.service.getVendas().subscribe((vendas:any) => {
  //     this.vendas = vendas.items

  //     const emailExiste = this.vendas.some(item => item.buyer.email === this.email);

  //     if (emailExiste) {
  //         this.router.navigate(['/form'], {
  //           queryParams: { 
  //             email: this.email,
  //             nome: this.nome,
  //             telefone: this.telefone,
  //             empresa: this.empresa
  //           } 
  //         })
  //     } else {
  //       alert('Empresa nao encontrada.')
  //     }
  //   })

  //   if (!this.isLoggedIn) {

  //     this.router.navigate(['/']);
  //     return false;
  //   }
  //   return true;
  // }

  canActivate(): Observable<boolean> {
  return new Observable<boolean>((observer:any) => {
    this.service.verificarEmail(this.email).subscribe((dados: any) => {
      if (dados.exists) {
        this.isLoggedIn = true;
        observer.next(true); // permite acesso
      } else {
        this.router.navigate(['/']);
        observer.next(false); // bloqueia
      }
      observer.complete();
    }, (error) => {
      console.error('Erro na verificação de e-mail:', error);
      this.router.navigate(['/']);
      observer.next(false);
      observer.complete();
    });
  });
}
}
