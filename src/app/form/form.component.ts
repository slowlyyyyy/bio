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

  // gerarPDF() {
  //   const element = document.getElementById('pdf-content');
    
  //   if (element) {
  //     html2canvas(element).then(canvas => {
  //       const imgData = canvas.toDataURL('image/png');
  //       const pdf = new jsPDF("l", "mm", "a4");

  //       const imgProps = pdf.getImageProperties(imgData);
  //       const pdfWidth = pdf.internal.pageSize.getWidth();
  //       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //       pdf.save(`${this.nome}-perfil-comportamental.pdf`);
  //     });
  //   }
  // }

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
    const pdf = new jsPDF('l', 'mm', 'a4');
    let y = 20;
    const musculoImg = await this.getBase64ImageFromURL('assets/musculo.png');
    const coracaoImg = await this.getBase64ImageFromURL('assets/coracao.png');
    const visaoImg = await this.getBase64ImageFromURL('assets/olho.png');
    const cerebroImg = await this.getBase64ImageFromURL('assets/cerebro.png');


    pdf.setFontSize(18);
    pdf.text('ANÁLISE DE PERFIL COMPORTAMENTAL - NED HERRMANN', 150, y, { align: 'center' });

    y += 10;

    pdf.setFontSize(12);
    pdf.text(`Data: ${this.dataHoje()}`, 20, y);
    y += 5;
    pdf.text(`Nome: ${this.nome}`, 20, y);
    y += 5;
    pdf.text(`Email: ${this.email}`, 20, y);
    y += 10;

    // Agora montamos a tabela diretamente

    autoTable(pdf, {
      head: [[
        'Arquetipo', 'Pts', '%', 'Imagem', 'Comportamento', 'P. Fortes', 'P. de Melhoria', 'Motivações', 'Valores'
      ]],
      body: [
        [
          'I - Visão', `${this.I}`, `${this.I * 4}%`,  'visao',
          'Fazer Diferente: Criativo, intuitivo, foco no futuro, distraido, Curioso/Informal/Flexivel',
          'Idealização: Provoca mudanças, antecipar o futuro, criatividade',
          'Impaciencia e rebeldia. Defender o novo pelo novo.',
          'Liberdade de expressão, ausência de controles rígidos. Oportunidade para delegar. Liberdade para fazer exceções tarefas e detalhes.',
          'Criatividade e liberdade, inspira ideias.'
        ],
        [
          'C - Coração', `${this.C}`, `${this.C * 4}%`,  'coracao',
          'Fazer Junto: Sensivel, relacionamento, time, tradicionalista, contribuição, busca harmonia.',
          'Comunicação: Comunicação harmonica. Desenvolver e manter a cultura empresarial. Comunicação aberta.',
          'Esconder conflitos. Felicidade em primeiro lugar. Manipulação dos sentimentos.',
          'SSegurança, aceitação social, construir o consenso. Reconhecimento da equipe. Supervisão compreensiva. Hambiente harmonico. Trabalho em grupo.',
          'Felicidade e igualdade. Cultura da empresa. Pensa nos outros.'
        ],
        [
          'O - Cérebro', `${this.O}`, `${this.O * 4}%`,  'cerebro',
          'Fazer Certo: Detalhista. Organizado. Estrategista. Pontual. Conservador. Previsivel.',
          'Organização: Passado, presente e futuro. Consistencia. Lealdade e segurança.',
          'Dificuldade de se adaptar. Pode impedir o progresso. Detalhista, estruturado. Demasiado, sistematizado.',
          'Certeza. Quais são as regras. Conhecimento do trabalho. Ausencia de riscos e erros. Começo, meio e fim.',
          'Ordem e controle.'
        ],
        [
          'A - Musculo', `${this.A}`, `${this.A * 4}%`, 'musculo', 
          'Fazer Rápido: Senso de urgencia. Ação, iniciativa. Impulso e prático. Vencer desafios. Aqui e agora / Auto suficiente.',
          'Ação: Fazer que ocorra. Parar com a burocracia. Motivação.',
          'Faz do modo mais facil. Relacionamento complicado.',
          'Liberdade para agir. Controle das proprias atividades. Resolver os problemas do seu jeito. Competição individual. Variedade de atividades. Não ter que repetir tarefas.',
          'Resultados.'
        ]
      ],
      startY: y,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellWidth: 'wrap'
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 12 },
        2: { cellWidth: 12 },
        3: { cellWidth: 30 },
        4: { cellWidth: 40 },
        5: { cellWidth: 40 },
        6: { cellWidth: 35 },
        7: { cellWidth: 55 },
        8: { cellWidth: 30 }
      },
      headStyles: { fillColor: [41, 128, 185], halign: 'center' },

        // Aqui está a mágica para pintar a linha de "Visão"
      didParseCell: function (data) {
        if (data.column.index === 3) {
          data.cell.text = ['']; // Remove texto antes da renderização
        }

        // Linha de cabeçalho já tratada
        if (data.row.section === 'head') {
          data.cell.styles.fillColor = [255, 255, 255]; // Fundo branco
          data.cell.styles.textColor = [0, 0, 0];       // Texto preto
        }
        
        // Linha da primeira linha (linha "Visão") com fundo verde e texto branco
        if (data.row.index === 0) {
          data.cell.styles.fillColor = [0, 200, 0]; // Verde
          data.cell.styles.textColor = [255, 255, 255]; // Branco
        }

        // Deixa as colunas 1 e 2 com fundo branco e texto preto
        if (data.column.index === 1 || data.column.index === 2 || data.column.index === 3) {
          data.cell.styles.fillColor = [255, 255, 255];
          data.cell.styles.textColor = [0, 0, 0];
        }

        // Linha da primeira linha (linha "Visão") com fundo verde e texto branco
        if (data.row.index === 1) {
          data.cell.styles.fillColor = [168, 28, 28]; // Verde
          data.cell.styles.textColor = [255, 255, 255]; // Branco
        }
        // Deixa as colunas 1 e 2 com fundo branco e texto preto
        if (data.column.index === 1 || data.column.index === 2 || data.column.index === 3) {
          data.cell.styles.fillColor = [255, 255, 255];
          data.cell.styles.textColor = [0, 0, 0];
        }

        if (data.row.index === 2) {
          data.cell.styles.fillColor = [31, 86, 168]; // Azul
          data.cell.styles.textColor = [255, 255, 255]; // Branco para o texto
        }
        // Deixa as colunas 1 e 2 com fundo branco e texto preto
        if (data.column.index === 1 || data.column.index === 2 || data.column.index === 3) {
          data.cell.styles.fillColor = [255, 255, 255];
          data.cell.styles.textColor = [0, 0, 0];
        }

        if (data.row.index === 3) {
          data.cell.styles.fillColor = [226, 201, 36]; // Amarelo
          data.cell.styles.textColor = [255, 255, 255]; // Branco para o texto
        }
        // Deixa as colunas 1 e 2 com fundo branco e texto preto
        if (data.column.index === 1 || data.column.index === 2 || data.column.index === 3) {
          data.cell.styles.fillColor = [255, 255, 255];
          data.cell.styles.textColor = [0, 0, 0];
        }
      },

      didDrawCell: function (data) {
        // Só atuamos na coluna 3 (onde as imagens são inseridas)
        if (data.column.index === 3) {
          // Desenha a imagem correspondente conforme o valor da célula
          if (data.cell.raw === 'visao') {
            pdf.addImage(visaoImg, 'PNG', data.cell.x + 1, data.cell.y + 1, 12, 12);
          }
          if (data.cell.raw === 'coracao') {
            pdf.addImage(coracaoImg, 'PNG', data.cell.x + 1, data.cell.y + 1, 12, 12);
          }
          if (data.cell.raw === 'cerebro') {
            pdf.addImage(cerebroImg, 'PNG', data.cell.x + 1, data.cell.y + 1, 12, 12);
          }
          if (data.cell.raw === 'musculo') {
            pdf.addImage(musculoImg, 'PNG', data.cell.x + 1, data.cell.y + 1, 12, 12);
          }

          // Remove o texto da célula da coluna 3 para não mostrar as palavras
          data.cell.text = [''];
        }
      }


      
    });

    pdf.save(`${this.nome}-perfil-comportamental.pdf`);
  }



}
