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
      console.log(this.vendas)
    })
    
  }

  login(){
    this.authService.setUser(this.email, this.nome, this.telefone)

    this.validateEmail();
    if (this.emailError) return;

    this.service.verificarEmail({ email: this.email }).subscribe((dados:any) => {

      if(dados.exists){
        this.autenticacao = true
        this.router.navigate(['/form'], {
          queryParams: { 
            email: this.email,
            nome: this.nome,
            telefone: this.telefone,
            empresa: this.empresa
          } 
        })
      }
    })

    if(this.autenticacao === false){ 
      setTimeout(() => {
        this.emailError = 'Email nao registrou pagamento.' 
      }, 2000)

    }
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
