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

      if(this.resposta?.letra === 'I'){ this.I += 1 }
      if(this.resposta?.letra === 'C'){ this.C += 1 }
      if(this.resposta?.letra === 'O'){ this.O += 1 }
      if(this.resposta?.letra === 'A'){ this.A += 1 }

      if (this.pergunta >= 1 && this.pergunta <= 25) {
        this.respostasSelecionadas[this.pergunta] = this.resposta.descricao;
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

    this.service.postForm(respostas).subscribe((dados:any) => {
          
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

  async getTransparentBase64Image(url: string, opacity: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // importante para evitar problemas de CORS
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.globalAlpha = opacity; // entre 0 (transparente) e 1 (opaco)
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject('Canvas context error');
        }
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  async gerarPDF() {
    const pdf = new jsPDF('p', 'mm', 'a4');

    const logoBiocoaching = await this.getTransparentBase64Image('assets/biocoaching-fundo.png', 0.1);
    pdf.addImage(logoBiocoaching, 'PNG', 40, 40, 130, 130);

    let y = 10;
    
    y += 7;
    pdf.setFontSize(16);
    pdf.text('ANÁLISE DE PERFIL COMPORTAMENTAL', 105, y, { align: 'center' });

    y += 12;

    pdf.setFontSize(12);
    pdf.text(`${this.nome}`, 15, y);
    y += 12;

    pdf.setFontSize(14);
    pdf.setFont("helvetica", 'bold');
    pdf.text('Parabéns!', 15, y);

    pdf.setFont("helvetica", 'normal');
    pdf.setFontSize(12);
    y += 8;

    const introducao = `
    Você acaba de receber o resultado do seu perfil comportamental, com base na metodologia de Ned Herrmann e no método 2VPS do Biocoaching. Este é um passo essencial no processo de autoconhecimento, pois entender o seu perfil ajuda você a tomar decisões mais alinhadas com quem realmente é — e não apenas com o que o mundo espera de você.

    Autoconhecimento para escolhas mais conscientes e relações mais saudáveis.
    `;

    const linhasIntro = pdf.splitTextToSize(introducao.trim(), 180); // largura em mm
    linhasIntro.forEach((linha:any) => {
      pdf.text(linha, 15, y);
      y += 7;
    });

    // pdf.setFont("helvetica", "bold");
    // const parte2 = " 2VPS do Biocoaching";
    // pdf.text(parte2, 15, y);

    pdf.setFont("helvetica", 'normal');
    pdf.setFontSize(12);

    y += 5; // pequeno espaço antes do próximo conteúdo
    const musculoImg = await this.getBase64ImageFromURL('assets/musculo.png');
    const coracaoImg = await this.getBase64ImageFromURL('assets/coracao.png');
    const visaoImg = await this.getBase64ImageFromURL('assets/olho.png');
    const cerebroImg = await this.getBase64ImageFromURL('assets/cerebro.png');


    autoTable(pdf, {
      head: [[ 'Perfil', 'Arquetipo', 'Pts', '%', 'Imagem' ]],
      body: [
        [ 'Analítico', 'O - Cérebro', `${this.O}`, `${this.O * 4}%`,  'cerebro' ],
        [ 'Prático', 'A - Musculo', `${this.A}`, `${this.A * 4}%`, 'musculo' ],
        [ 'Relacional', 'C - Coração', `${this.C}`, `${this.C * 4}%`,  'coracao' ],
        [ 'Visionário', 'I - Visão', `${this.I}`, `${this.I * 4}%`,  'visao' ]
      ],
      startY: y,
      theme: 'plain',
      styles: {
        fontSize: 11,
        cellPadding: { top: 5, bottom: 5 },
        halign: 'center',
        valign: 'middle',
        textColor: [0, 0, 0],        // texto preto
        lineWidth: 0.1               // quase imperceptível
      },

      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 35 },
        4: { cellWidth: 35 }
      },

      headStyles: {
        fontSize: 13,
        fontStyle: 'bold',
        fillColor: false, // desativa fundo do cabeçalho
        textColor: [0, 0, 0],
        lineWidth: 0,
      },

      // headStyles: {
      //   fillColor: [220, 220, 220],
      //   textColor: [0, 0, 0],
      //   fontSize: 13,
      //   fontStyle: 'bold',
      // },

      didParseCell: function (data) {
        if (data.column.index === 4 && data.section === 'body') {
          data.cell.text = [''];
        }
      },

      didDrawCell: function (data) {

        if (data.column.index === 4) {
          if (data.cell.raw === 'visao') {
            pdf.addImage(visaoImg, 'PNG', data.cell.x + 7, data.cell.y + -4, 19, 19);
          }
          if (data.cell.raw === 'coracao') {
            pdf.addImage(coracaoImg, 'PNG', data.cell.x + 9, data.cell.y + -1 , 15, 15);
          }
          if (data.cell.raw === 'cerebro') {
            pdf.addImage(cerebroImg, 'PNG', data.cell.x + 9, data.cell.y + -1, 15, 15);
          }
          if (data.cell.raw === 'musculo') {
            pdf.addImage(musculoImg, 'PNG', data.cell.x + 9, data.cell.y + 0, 15, 14);
          }
          data.cell.text = [''];
        }
      }
      
    });

    const Texto1 = `
      Quando o pesquisador Ned Herrmann desenvolveu a teoria da dominância cerebral, ele percebeu algo essencial: entender como pensamos, sentimos e agimos é determinante para fazermos escolhas mais assertivas — tanto na vida pessoal quanto profissional. Ele compreendeu que cada pessoa utiliza diferentes áreas do cérebro de maneira predominante, o que influencia diretamente seu comportamento, suas reações emocionais e até suas decisões.
      Muitas vezes, nos sentimos irritados conosco ou com outras pessoas por não compreendermos os pontos frágeis que carregamos em nosso perfil. Achamos que estamos "certos", mas a verdade é que não existe certo ou errado quando falamos de perfis comportamentais. Existe apenas o momento em que você está, o quanto isso faz sentido para você, e se há espaço — e desejo — para evoluir.
      O método 2VPS do Biocoaching se baseia nessa premissa: entender seus comportamentos e sua dominância cerebral para que você possa agir com mais equilíbrio, propósito e autenticidade.
      Esse entendimento também se conecta com os estudos de Carl Gustav Jung, que trouxe à tona a importância dos arquétipos — símbolos universais que habitam nosso inconsciente coletivo e moldam nosso comportamento, mesmo sem que a gente perceba. Esses arquétipos representam padrões psicológicos profundos que aparecem em mitos, histórias, e nos nossos perfis comportamentais.
      Dentro dessa visão, os perfis do método 2VPS se conectam com quatro arquétipos comportamentais relacionados ao corpo:

      - Cérebro (análise, lógica, estratégia)
      - Músculo (ação, força, impulso)
      - Coração (relações, empatia, conexão)
      - Visão (imaginação, criatividade, futuro)

      Ao conhecer seu perfil, você se liberta de rótulos e passa a enxergar possibilidades de evolução, respeitando sua essência.

      Pontos de atenção se algum resultado foi abaixo de 16% ou acima de 32%.

      O Perfil Relacional: A Inteligência do Coração em Movimento
      O perfil Relacional se comunica de forma calorosa, gentil e afetiva, preferindo conversas presenciais, com escuta ativa e expressões que transmitem cuidado e acolhimento. Busca criar conexão verdadeira, evitando discursos frios ou duros que possam ferir. Absorve informações mais pelo “como” — o clima, o tom e a intenção por trás da mensagem — do que pelo conteúdo em si. Aprende melhor por meio de histórias, vivências e exemplos reais, especialmente quando há envolvimento emocional. Vê o mundo principalmente como um espaço de relações, afeto e cooperação, valorizando a harmonia e o pertencimento.
      Ao reagir, o Relacional processa primeiro as emoções e só depois a razão. Pode levar tempo para digerir críticas, mudanças bruscas ou falas mal colocadas, e muitas vezes suas reações aparecem depois, na forma de preocupação, tristeza ou necessidade de conversar e entender melhor a situação. Precisa de espaço para sentir e nomear suas emoções antes de tomar decisões.
      Lado Sombrio: Quando o Relacional está desequilibrado, sua maior força — a capacidade de amar e acolher — pode virar uma armadilha. Ele pode acabar dizendo “sim” quando queria dizer “não”, movido pelo medo de decepcionar ou causar conflito. Reprime seus próprios sentimentos para evitar desentendimentos, coloca as necessidades dos outros sempre à frente das suas e evita confrontos, mesmo quando eles são importantes para seu crescimento. Esse comportamento pode levar a um acúmulo silencioso de frustração, esgotamento emocional e sensação de não ser reconhecido. Além disso, tende a interpretar divergências como rejeição pessoal, tornando-se mais vulnerável a críticas, mesmo as construtivas.
      É importante olhar para esse perfil com compaixão e compreensão, reconhecendo que o Relacional tem um coração imenso, mas que precisa cuidar de si para não se perder no caminho. Seu desafio é aprender que cuidar de si mesmo não diminui seu amor pelo outro — pelo contrário, fortalece suas relações e sua autenticidade. Cada passo dado para equilibrar essa energia é um ato de coragem e amor-próprio, que permite ao Relacional construir vínculos verdadeiros, duradouros e saudáveis, onde pode ser inteiro, visto e acolhido do jeito que é.
    `;

    // Pega o Y atual (onde a tabela terminou)
    const finalY = (pdf as any).lastAutoTable.finalY + 5; // espaçamento após tabela

    // Divide o texto em linhas que cabem na página A4
    const linhas = pdf.splitTextToSize(Texto1, 180); // largura da linha em mm

    // Adiciona o texto linha por linha
    let yTexto = finalY;
    pdf.setFontSize(12);

    linhas.forEach((linha:any) => {
      if (yTexto > 280) { // quase no fim da página A4
        pdf.addPage();
        pdf.addImage(logoBiocoaching, 'PNG', 40, 40, 130, 130);
        yTexto = 20;
      }
      pdf.text(linha, 15, yTexto);
      yTexto += 7;
    });

    const dadosRelacional = [
      ['Empatia', 'Promove harmonia nas relações', 'Dificuldade em impor limites; tendência a não saber dizer "não"'],
      ['Paciência', 'Facilidade no trabalho em equipe', 'Medo do julgamento e da desaprovação alheia'],
      ['Sensibilidade', 'Estabelece conexões humanas profundas', 'Tendência a se afetar emocionalmente'],
      ['Escuta ativa', 'Habilidade para resolver conflitos', 'Dificuldade em lidar com pressão ou ambientes tensos'],
    ];

    autoTable(pdf, {
      head: [[ 'Comportamento', 'Pontos fortes', 'Pontos a melhorar' ]],
      body: dadosRelacional,
      startY: yTexto - 7, // adiciona um espaço após o texto
      theme: 'plain',
      styles: {
        fontSize: 11,
        cellPadding: { top: 5, bottom: 5 },
        halign: 'center',
        valign: 'middle',
        textColor: [0, 0, 0],        // texto preto
        lineWidth: 0.1               // quase imperceptível
      },
      headStyles: {
        fontSize: 13,
        fontStyle: 'bold',
        fillColor: false, // desativa fundo do cabeçalho
        textColor: [0, 0, 0],
        lineWidth: 0,
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 65 },
        2: { cellWidth: 65 }
      }
    });

    const texto2 = `
      O Perfil Prático: O Músculo da Ação
      No nosso método, o perfil Prático é chamado de “músculo” por sua força, energia e disposição para agir. É um perfil que enfrenta desafios de frente, toma decisões rápidas e vê obstáculos como degraus para crescer. Comunica-se de forma direta e objetiva, preferindo eficiência e clareza. Absorve informações focando nos fatos e dados essenciais para agir rápido, sem se perder em detalhes. Reage com agilidade e energia, especialmente em situações urgentes, mantendo firmeza diante de conflitos, o que pode parecer inflexibilidade.
      Esse perfil prospera em ambientes competitivos, assumindo riscos com coragem e valorizando resultados imediatos.
      Lado Sombrio: Sem equilíbrio emocional, pode tornar-se duro, impositivo e até agressivo, afastando pessoas sem intenção. Sua comunicação não verbal pode ser abrupta, e a rigidez pode prejudicar relacionamentos. Por isso, a autoconsciência é essencial para equilibrar força com empatia, entendendo que pessoas não são projetos e que a empatia torna a força mais eficaz e respeitosa.
      Com Inteligência Emocional: O perfil Prático se transforma em um líder completo que decide com firmeza, ouve atentamente, aprende com críticas e mantém flexibilidade emocional. A verdadeira força está em liderar pelo exemplo, sentir sem se perder, servir sem se ferir e construir relacionamentos verdadeiros
    `;

    // Pega o Y atual (onde a tabela terminou)
    const finalY2 = (pdf as any).lastAutoTable.finalY + 5; // espaçamento após tabela

    // Divide o texto em linhas que cabem na página A4
    const linhas2 = pdf.splitTextToSize(texto2, 180); // largura da linha em mm

    // Adiciona o texto linha por linha
    let yTexto2 = finalY2;
    pdf.setFontSize(12);

    linhas2.forEach((linha:any) => {
      if (yTexto2 > 280) { // quase no fim da página A4
        pdf.addPage();
        pdf.addImage(logoBiocoaching, 'PNG', 40, 40, 130, 130);
        yTexto2 = 20;
      }
      pdf.text(linha, 15, yTexto2);
      yTexto2 += 7;
    });

    const dados2 = [
      ['Energia elevada', 'Gosta de desafios e da ação', 'Impulsividade; age antes de refletir'],
      ['Disciplina', 'Agilidade e assertividade nas decisões', 'Comunicação direta em excesso; fala sem filtro'],
      ['Organização', 'Proatividade e foco no resultado', 'Linguagem corporal intimidadora, mesmo que sem intenção'],
      ['Resiliência', 'Alta capacidade na execução', 'Tom de voz soar agressivo em determinadas contextos'],
    ];

    autoTable(pdf, {
      head: [[ 'Comportamento', 'Pontos fortes', 'Pontos a melhorar' ]],
      body: dados2,
      startY: yTexto2 - 7, // adiciona um espaço após o texto
      theme: 'plain',
      styles: {
        fontSize: 11,
        cellPadding: { top: 5, bottom: 5 },
        halign: 'center',
        valign: 'middle',
        textColor: [0, 0, 0],        // texto preto
        lineWidth: 0.1               // quase imperceptível
      },
      headStyles: {
        fontSize: 13,
        fontStyle: 'bold',
        fillColor: false, // desativa fundo do cabeçalho
        textColor: [0, 0, 0],
        lineWidth: 0,
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 65 },
        2: { cellWidth: 65 }
      }
    });

    const Texto3 = `
      O Perfil Analítico: A Força da Lógica com Inteligência Emocional
      No nosso método, o perfil Cérebro representa pessoas analíticas, racionais e movidas por dados, organização e clareza. São capazes de resolver problemas complexos, identificar falhas e tomar decisões baseadas em fatos, sendo confiáveis em ambientes que exigem precisão e foco. Encaram desafios mentais com estratégia, firmeza e senso de justiça.
      O Cérebro se comunica de forma clara, objetiva e direta, preferindo dados concretos e argumentos lógicos, evitando discursos emotivos. Absorve informações detalhadas, analisando criticamente dados e fatos para decisões fundamentadas. Pode parecer reservado, respondendo de forma ponderada e focada em soluções práticas.
      É importante que esse perfil seja analisado com autopercepção e neutralidade para reconhecer seus impactos nas relações.
      Lado Sombrio: Quando desregulado, o Analítico pode se tornar rígido, perfeccionista e emocionalmente frio, desconsiderando emoções alheias e gerando desconexão. Sua comunicação direta pode parecer agressiva. A necessidade de controle pode gerar impaciência e julgamento, além de dificultar a demonstração de vulnerabilidade e a adaptação.
      O equilíbrio surge ao integrar lógica com inteligência emocional, desenvolvendo escuta ativa, aceitando incertezas e aprendendo com falhas (antifragilidade). Um Analítico equilibrado inspira confiança com clareza e respeito, usando sua mente como ponte e não barreira, tornando-se essencial para trazer estrutura, lucidez e soluções concretas em equipes e projetos.

      *Aqui vale uma distinção importante: o cérebro é apenas um órgão, mas a mente, segundo Jung, é um arquétipo — um símbolo de como organizamos e interpretamos o mundo. Por isso, ao falar de “cérebro” no contexto do perfil analítico, estamos nos referindo à mente analítica, o modo como esse arquétipo atua na nossa forma de pensar.
    `;

    // Pega o Y atual (onde a tabela terminou)
    const FinalY3 = (pdf as any).lastAutoTable.finalY + 5; // espaçamento após tabela

    // Divide o texto em linhas que cabem na página A4
    const linhas3 = pdf.splitTextToSize(Texto3, 180); // largura da linha em mm

    // Adiciona o texto linha por linha
    let yTexto3 = FinalY3;
    pdf.setFontSize(12);

    linhas3.forEach((linha:any) => {
      if (yTexto3 > 280) { // quase no fim da página A4
        pdf.addPage();
        pdf.addImage(logoBiocoaching, 'PNG', 40, 40, 130, 130);
        yTexto3 = 20;
      }
      pdf.text(linha, 15, yTexto3);
      yTexto3 += 7;
    });

    const dados3 = [
      ['Organização', 'Pensamento estratégico e lógico', 'Tendência ao perfeccionismo'],
      ['Disciplina', 'Planejamento com excelência', 'Dificuldade de adaptação a mudanças inesperadas'],
      ['Controle', 'Busca pela excelência nos resultados', 'Medo de errar, o que pode gerar estresse'],
      ['Análise crítica', 'Olhar detalhista e preciso', 'Lentidão nas tomadas de decisão'],
    ];

    autoTable(pdf, {
      head: [[ 'Comportamento', 'Pontos fortes', 'Pontos a melhorar' ]],
      body: dados3,
      startY: yTexto3 - 7, // adiciona um espaço após o texto
      theme: 'plain',
      styles: {
        fontSize: 11,
        cellPadding: { top: 5, bottom: 5 },
        halign: 'center',
        valign: 'middle',
        textColor: [0, 0, 0],        // texto preto
        lineWidth: 0.1               // quase imperceptível
      },
      headStyles: {
        fontSize: 13,
        fontStyle: 'bold',
        fillColor: false, // desativa fundo do cabeçalho
        textColor: [0, 0, 0],
        lineWidth: 0,
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 65 },
        2: { cellWidth: 65 }
      }
    });

    const Texto4 = `
      O Perfil Visionário: Força com Consciência e Inteligência Emocional
      No nosso método, o perfil Visionário representa pessoas movidas por desafios, focadas no futuro, apaixonadas por inovação e transformação. Sua energia contagiante impulsiona projetos e inspira mudanças, sendo um motor potente para equipes.
      Comunicação, Absorção e Reação
      O Visionário comunica-se com clareza, entusiasmo e assertividade, valorizando ideias grandes e soluções rápidas, embora detalhes possam ficar em segundo plano. Sua comunicação verbal é intensa, o que pode ser interpretado como impaciência ou agressividade. Absorve informações de forma seletiva e rápida, focando no essencial e nas possibilidades futuras, o que facilita conexões inovadoras, mas pode deixar passar nuances importantes. Reage com prontidão, agindo rapidamente diante de desafios, o que pode causar tensão com quem prefere mais cautela.
      Consciência e Autopercepção
      Para esse perfil, a autopercepção é vital. A intensidade do Visionário pode ser mal compreendida como arrogância ou imposição. Ele precisa cultivar escuta ativa, empatia e cuidado com a comunicação não verbal para evitar desconexões e manter relacionamentos saudáveis.
      Lado Sombrio
      Quando desequilibrado, o Visionário pode ser impositivo, impaciente e insensível, acreditando que sua visão é superior e negligenciando contribuições dos outros. A ansiedade por resultados rápidos gera frustração, controle excessivo e perfeccionismo que dificultam a colaboração. Tem dificuldade em mostrar vulnerabilidade, criando uma armadura emocional que isola e impede conexões genuínas.
      Integrando Luz e Sombra
      Um Visionário equilibrado alia força e sabedoria, acolhe erros como aprendizado e lidera com firmeza sem ferir. Ele influencia com autenticidade, respeitando o tempo dos outros. O autoconhecimento e a regulação emocional distinguem um líder inspirador de um chefe autoritário, tornando-o capaz de conectar pessoas ao propósito com clareza, humanidade e presença.
    `;

    // Pega o Y atual (onde a tabela terminou)
    const finalY4 = (pdf as any).lastAutoTable.finalY + 5; // espaçamento após tabela

    // Divide o texto em linhas que cabem na página A4
    const linhas4 = pdf.splitTextToSize(Texto4, 180); // largura da linha em mm

    // Adiciona o texto linha por linha
    let yTexto4 = finalY4;
    pdf.setFontSize(12);

    linhas4.forEach((linha:any) => {
      if (yTexto4 > 280) { // quase no fim da página A4
        pdf.addPage();
        pdf.addImage(logoBiocoaching, 'PNG', 40, 40, 130, 130);
        yTexto4 = 20;
      }
      pdf.text(linha, 15, yTexto4);
      yTexto4 += 7;
    });

    const dados4 = [
      ['Criatividade', 'Capacidade de provocar mudanças', 'Impaciência com processos e limitações'],
      ['Distração', 'Antecipação de tendências e cenários', 'Comportamento desafiador às regras estabelecidas'],
      ['Curiosidade', 'Raciocínio ágil e inovador', 'Dificuldade de manter o foco em tarefas contínuas'],
      ['Proatividade', 'Visão de oportunidades e soluções', 'Tendência a não concluir projetos iniciados'],
    ];

    autoTable(pdf, {
      head: [[ 'Comportamento', 'Pontos fortes', 'Pontos a melhorar' ]],
      body: dados4,
      startY: yTexto4 - 7, // adiciona um espaço após o texto
      theme: 'plain',
      styles: {
        fontSize: 11,
        cellPadding: { top: 5, bottom: 5 },
        halign: 'center',
        valign: 'middle',
        textColor: [0, 0, 0],        // texto preto
        lineWidth: 0.1               // quase imperceptível
      },
      headStyles: {
        fontSize: 13,
        fontStyle: 'bold',
        fillColor: false, // desativa fundo do cabeçalho
        textColor: [0, 0, 0],
        lineWidth: 0,
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 65 },
        2: { cellWidth: 65 }
      }
    });


    const Texto5 = `
      Com esse mapa em mãos, você tem a oportunidade de se fortalecer ainda mais. Não se trata de mudar quem você é — mas de usar suas características com consciência, otimizando seus talentos e cuidando dos excessos.
      Você não é um rótulo. Você é um ser humano em constante evolução. E o autoconhecimento é o melhor ponto de partida para realizar mudanças duradouras.
    `;

    // Pega o Y atual (onde a tabela terminou)
    const finalY5 = (pdf as any).lastAutoTable.finalY + 5; // espaçamento após tabela

    // Divide o texto em linhas que cabem na página A4
    const linhas5 = pdf.splitTextToSize(Texto5, 180); // largura da linha em mm

    // Adiciona o texto linha por linha
    let yTexto5 = finalY5;
    pdf.setFontSize(12);

    linhas5.forEach((linha:any) => {
      if (yTexto5 > 280) { // quase no fim da página A4
        pdf.addPage();
        pdf.addImage(logoBiocoaching, 'PNG', 40, 40, 130, 130);
        yTexto5 = 20;
      }
      pdf.text(linha, 15, yTexto5);
      yTexto5 += 7;
    });

    pdf.save(`${this.nome}-perfil-comportamental.pdf`);
  }



}
