import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit{

  nome:string = ''
  email:string = ''
  respostaSelecionada1: string = '';
  resposta: { letra: string, descricao: string } | null = null;
  respostasSelecionadas: { [key: number]: string } = {};

  I: number = 0;
  C: number = 0;
  O: number = 0;
  A: number = 0;

  constructor(
    private service: ServiceService,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.nome = params['nome'];
    });
  }

  pergunta:number = 1

  proxima(){
    if(this.resposta?.letra !== undefined ) { 
      console.log(this.resposta?.letra) 

      if(this.resposta?.letra === 'I'){ this.I += 1 }
      if(this.resposta?.letra === 'C'){ this.C += 1 }
      if(this.resposta?.letra === 'O'){ this.O += 1 }
      if(this.resposta?.letra === 'A'){ this.A += 1 }

      console.log(`I = ${this.I}`)
      console.log(`C = ${this.C}`)
      console.log(`O = ${this.O}`)
      console.log(`A = ${this.A}`)

      if (this.pergunta >= 1 && this.pergunta <= 25) {
        this.respostasSelecionadas[this.pergunta] = this.resposta.descricao;
        console.log(this.respostasSelecionadas)
      }

      this.pergunta += 1
      this.resposta = null
    }

  }

  anterior(){
    this.pergunta -= 1
  }

  concluir(){

    this.proxima();

    let respostas = {
      nome: this.nome, 
      email: this.email,
      resposta1: this.respostasSelecionadas[1],
      resposta2: this.respostasSelecionadas[2],
      resposta3: this.respostasSelecionadas[3],
      resposta4: this.respostasSelecionadas[4],
      resposta5: this.respostasSelecionadas[5],
      resposta6: this.respostasSelecionadas[6],
      resposta7: this.respostasSelecionadas[7],
      resposta8: this.respostasSelecionadas[8],
      resposta9: this.respostasSelecionadas[9],
      resposta10: this.respostasSelecionadas[10],
      resposta11: this.respostasSelecionadas[11],
      resposta12: this.respostasSelecionadas[12],
      resposta13: this.respostasSelecionadas[13],
      resposta14: this.respostasSelecionadas[14],
      resposta15: this.respostasSelecionadas[15],
      resposta16: this.respostasSelecionadas[16],
      resposta17: this.respostasSelecionadas[17],
      resposta18: this.respostasSelecionadas[18],
      resposta19: this.respostasSelecionadas[19],
      resposta20: this.respostasSelecionadas[20],
      resposta21: this.respostasSelecionadas[21],
      resposta22: this.respostasSelecionadas[22],
      resposta23: this.respostasSelecionadas[23],
      resposta24: this.respostasSelecionadas[24],
      resposta25: this.respostasSelecionadas[25],
      // I: this.I,
      // C: this.C,
      // O: this.O,
      // A: this.A,
    }

    this.service.postForm(respostas).subscribe((dados:any) => {
      console.log(dados)
      console.log(respostas)
          
      setTimeout(() => {
        this.gerarPDF();
      }, 100); 
    })
  }

  dataHoje(): string {
    const hoje = new Date();
    return hoje.toLocaleDateString();
  }

  calcularPercentual(valor: number): number {
    const total = this.I + this.C + this.O + this.A;
    return total ? Math.round((valor / total) * 100) : 0;
  }

  gerarPDF() {
    const element = document.getElementById('pdf-content');
    
    if (element) {
      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF("p", "mm", "a4");

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${this.nome}-perfil-comportamental.pdf`);
      });
    }
  }

}
