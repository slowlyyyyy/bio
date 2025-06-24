import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute } from '@angular/router';
import 'jspdf-autotable';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit{

  nome:string = ''
  email:string = ''
  telefone:string = ''
  empresa:string = ''
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
      this.telefone = params['telefone'];
      this.empresa = params['empresa'];
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
      telefone: this.telefone,
      empresa: this.empresa,
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
      visao: this.I,
      coracao: this.C,
      cerebro: this.O,
      musculo: this.A,
    }

    console.log(respostas)

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

  getBase64ImageFromURL(url:any): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Não foi possível obter o contexto 2D do canvas');
          return;
        }
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = error => reject(error);
      img.src = url;
    });
  }

  async gerarPDF() {
    const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' = portrait (retrato/em pé)
    let y = 20;
    const musculoImg = await this.getBase64ImageFromURL('assets/musculo.png');
    const coracaoImg = await this.getBase64ImageFromURL('assets/coracao.png');
    const visaoImg = await this.getBase64ImageFromURL('assets/olho.png');
    const cerebroImg = await this.getBase64ImageFromURL('assets/cerebro.png');


    // pdf.setFontSize(12);
    // pdf.text(`${this.dataHoje()}`, 150, y,  { align: 'center' });
    y += 7;
    pdf.setFontSize(16);
    pdf.text('ANÁLISE DE PERFIL COMPORTAMENTAL - NED HERRMANN', 110, y, { align: 'center' });

    y += 10;

    pdf.setFontSize(12);
    pdf.text(`Nome: ${this.nome}`, 15, y);
    y += 10;
    // pdf.text(`Email: ${this.email}`, 20, y);
    // y += 10;

    autoTable(pdf, {
      head: [[ 'Perfil', 'Arquetipo', 'Pts', '%', 'Imagem' ]],
      body: [
        [ 'Visionário', 'I - Visão', `${this.I}`, `${this.I * 4}%`,  'visao' ],
        [ 'Relacional', 'C - Coração', `${this.C}`, `${this.C * 4}%`,  'coracao' ],
        [ 'Analítico', 'O - Cérebro', `${this.O}`, `${this.O * 4}%`,  'cerebro' ],
        [ 'Prático', 'A - Musculo', `${this.A}`, `${this.A * 4}%`, 'musculo' ]
      ],
      startY: y,
      theme: 'grid',

      styles: {
        fontSize: 12,
        cellWidth: 'wrap',
        lineWidth: 0,
        cellPadding: { top: 10, bottom: 10 },
        halign: 'center',
        valign: 'middle',
      },

      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40 },
        4: { cellWidth: 35 }
      },

      headStyles: { 
        fillColor: [255, 255, 255], 
        textColor: [0, 0, 0],
        halign: 'center',
        fontSize: 15,
        fontStyle: 'bold'
      },

      didParseCell: function (data) {
        if (data.column.index === 4 && data.section === 'body') {
          data.cell.text = [''];
        }
      },

      didDrawCell: function (data) {

        if (data.column.index === 4) {
          if (data.cell.raw === 'visao') {
            pdf.addImage(visaoImg, 'PNG', data.cell.x + 1, data.cell.y + 1, 25, 20);
          }
          if (data.cell.raw === 'coracao') {
            pdf.addImage(coracaoImg, 'PNG', data.cell.x + 1, data.cell.y + 1, 25, 20);
          }
          if (data.cell.raw === 'cerebro') {
            pdf.addImage(cerebroImg, 'PNG', data.cell.x + 1, data.cell.y + 1, 25, 20);
          }
          if (data.cell.raw === 'musculo') {
            pdf.addImage(musculoImg, 'PNG', data.cell.x + 1, data.cell.y + 1, 25, 20);
          }
          data.cell.text = [''];
        }
      }
      
    });

    pdf.save(`${this.nome}-perfil-comportamental.pdf`);
  }



}
