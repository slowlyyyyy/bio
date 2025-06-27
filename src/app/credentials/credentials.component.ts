import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { AuthGuard } from '../auth.guard';


@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.css']
})
export class CredentialsComponent implements OnInit{

  vendas:any[] = []
  emails:any[] = []
  email = ''
  telefone = ''
  nome = ''
  empresa = ''
  autenticacao:boolean = false
  emailError = ''
  

  constructor(
    private router: Router,
    private service: ServiceService,
    private authService: AuthGuard
  ) {}

  ngOnInit(): void {
    this.service.getVendas().subscribe((vendas:any) => {
      this.vendas = vendas.items
    })
  }

  login(){
    this.authService.setUser(this.email, this.nome, this.telefone, this.empresa)

    this.validateEmail();
    if (this.emailError) return;

    this.vendas.forEach((vendas:any) => {

      if(vendas.buyer.email === this.email){
        this.emailError = ''
        this.router.navigate(['/form'], {
          queryParams: { 
            email: this.email,
            nome: this.nome,
            telefone: this.telefone,
            empresa: this.empresa
          } 
        })
        this.autenticacao = true
      }
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
          this.autenticacao = true
        }
      })
    })

    if(this.autenticacao === false){ this.emailError = 'Email nao registrou pagamento.' }

  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!this.email) {
      this.emailError = 'O e-mail é obrigatório.';
    } else if (!emailRegex.test(this.email)) {
      this.emailError = 'Formato de e-mail inválido.';
    } else {
      this.emailError = '';
    }
  }
  
}
