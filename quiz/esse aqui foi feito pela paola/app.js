const WHATSAPP_NUMBER = "5511992794634";

const profiles = {
  autoridade: {
    title: "Autoridade Offline",
    tag: "Presença digital baixa",
    headline: "Seu relacionamento continua sendo seu maior ativo. Agora ele precisa ser encontrado online.",
    diagnosis: "Você tem reputação e confiança, mas parte dos compradores já pesquisa antes de pedir indicação. Sem presença ativa, concorrentes menos experientes podem aparecer primeiro.",
    mechanism: "A Virtual Mark transforma sua autoridade em presença local: uma página simples de apresentação, anúncios para compradores da sua região e WhatsApp preparado para separar curioso de comprador sério.",
    nextSteps: [
      "Anunciar sua atuação nos bairros onde você já tem autoridade e bons imóveis para oferecer.",
      "Mostrar sua experiência em uma página simples antes da pessoa chamar no WhatsApp.",
      "Atrair compradores que pesquisam imóveis na sua região antes de pedir indicação."
    ],
    cta: "Quero proteger meu território digital"
  },
  portais: {
    title: "Refém dos Portais",
    tag: "Canal alugado",
    headline: "O problema não é pagar para aparecer. É pagar por um contato que também chega para vários corretores.",
    diagnosis: "Seu custo está preso em uma vitrine compartilhada. Quando a mesma pessoa interessada fala com muitos corretores, velocidade vira desespero e margem vira pressão.",
    mechanism: "A Virtual Mark cria captação própria: anúncios por região, perfil do imóvel e faixa de preço, levando o comprador para uma conversa direta com você.",
    nextSteps: [
      "Criar anúncios para imóveis ou regiões que você quer vender, sem disputar o mesmo contato do portal.",
      "Manter o portal como apoio enquanto testamos compradores vindos direto para seu WhatsApp.",
      "Comparar qual origem trouxe conversas melhores: portal, Instagram, Google ou indicação."
    ],
    cta: "Quero comparar portal vs. captação própria"
  },
  anuncios: {
    title: "Anúncios Sem Estrutura",
    tag: "Tentou e parou",
    headline: "Você provavelmente não falhou no digital. A estrutura é que não estava completa.",
    diagnosis: "Impulsionar post ou rodar anúncio sem escolher bem a região, o tipo de imóvel, a faixa de renda e o caminho até o WhatsApp costuma atrair curiosos. Isso gera frustração, mas não invalida o canal.",
    mechanism: "A Virtual Mark monta o caminho inteiro: anúncio, público certo, página simples do imóvel ou da região, WhatsApp e leitura das conversas para saber o que ajustar.",
    nextSteps: [
      "Separar anúncios por região e faixa de preço: exemplo, imóveis acima de R$900 mil para bairros com maior poder de compra.",
      "Usar fotos e chamadas que filtram curiosos, deixando claro bairro, padrão do imóvel e perfil de comprador.",
      "Mandar a pessoa para uma conversa no WhatsApp com perguntas simples: região desejada, prazo de compra e faixa de investimento."
    ],
    cta: "Quero entender o que deu errado"
  },
  estrutura: {
    title: "Pronto Para Começar",
    tag: "Falta infraestrutura",
    headline: "Você já entendeu o caminho. Agora falta montar a base sem queimar verba.",
    diagnosis: "O risco hoje não é começar pequeno. É começar anunciando qualquer coisa para qualquer pessoa, sem escolher região, tipo de imóvel, faixa de preço e rotina de atendimento.",
    mechanism: "A Virtual Mark desenha um plano de lançamento com investimento mínimo, estrutura enxuta e métricas simples para decidir o próximo passo.",
    nextSteps: [
      "Escolher uma primeira frente: um bairro, um tipo de imóvel e uma faixa de preço para não dispersar verba.",
      "Anunciar para pessoas com perfil de compra compatível com aquele imóvel ou região.",
      "Criar uma resposta inicial no WhatsApp que qualifica a pessoa antes de tomar tempo do corretor."
    ],
    cta: "Quero um plano de lançamento"
  },
  otimizacao: {
    title: "Tráfego em Otimização",
    tag: "Já investe",
    headline: "Seu digital já funciona em parte. A pergunta é quanto resultado está ficando na mesa.",
    diagnosis: "Quando o corretor também vira a pessoa que cuida dos anúncios, a operação perde cadência. Anúncio para bairro errado, imóvel mal apresentado ou contato mal filtrado vira dinheiro perdido todo mês.",
    mechanism: "A Virtual Mark revisa anúncios, regiões, fotos, chamadas e conversas recebidas para mostrar quais compradores valem investimento e quais só tomam tempo.",
    nextSteps: [
      "Ver quais bairros, faixas de preço e tipos de imóvel geram conversas melhores.",
      "Cortar anúncios que atraem curiosos ou pessoas fora do poder de compra necessário.",
      "Criar um relatório simples: dinheiro investido, conversas boas, visitas marcadas e propostas."
    ],
    cta: "Quero auditar minhas campanhas"
  },
  escala: {
    title: "Operação Imobiliária em Escala",
    tag: "Equipe e previsibilidade",
    headline: "Sua equipe não precisa de mais contatos aleatórios. Precisa de oportunidades previsíveis.",
    diagnosis: "Com equipe, marketing deixa de ser ação pontual e vira infraestrutura comercial. Sem rastreio por campanha e corretor, fica difícil saber onde escalar.",
    mechanism: "A Virtual Mark estrutura anúncios por perfil de comprador, acompanhamento por corretor e distribuição dos contatos até virar visita ou proposta.",
    nextSteps: [
      "Separar campanhas por carteira: alto padrão, lançamentos, investidores ou imóveis prontos.",
      "Medir quais contatos viraram visita, proposta e venda por corretor.",
      "Distribuir contatos conforme perfil do comprador e especialidade de cada corretor."
    ],
    cta: "Quero estruturar captação previsível"
  }
};

const questions = [
  {
    id: "momento",
    title: "Qual dessas frases descreve melhor seu momento hoje?",
    subtitle: "Escolha a opção que você diria em uma conversa sincera.",
    options: [
      ["A", "Tenho nome no mercado, mas sinto que dependo demais de indicação.", { autoridade: 5 }],
      ["B", "Pago portais, mas os contatos vêm disputados e cada vez piores.", { portais: 5 }],
      ["C", "Já tentei anúncios e só veio curioso.", { anuncios: 5 }],
      ["D", "Sei que preciso do digital, mas não sei montar a estrutura.", { estrutura: 5 }],
      ["E", "Já faço anúncios, mas acho que estou perdendo dinheiro ou tempo.", { otimizacao: 5 }],
      ["F", "Tenho equipe e preciso de previsibilidade, não tentativa e erro.", { escala: 5 }]
    ]
  },
  {
    id: "escape",
    title: "Quando você perde uma oportunidade, onde ela normalmente escapa?",
    subtitle: "Aqui a gente separa falta de demanda de vazamento no processo.",
    options: [
      ["A", "O cliente nem chega até mim.", { autoridade: 3, estrutura: 1 }],
      ["B", "Chega junto com vários outros corretores.", { portais: 4 }],
      ["C", "Chega sem perfil para o imóvel que vendo.", { anuncios: 3, otimizacao: 1, escala: 1 }],
      ["D", "Chega, mas o atendimento não acontece rápido o suficiente.", { estrutura: 2, escala: 3 }],
      ["E", "Chega, mas eu não sei medir se virou venda.", { otimizacao: 3, escala: 2 }],
      ["F", "Não sei dizer exatamente.", { estrutura: 2, anuncios: 2 }]
    ]
  },
  {
    id: "controle",
    title: "Hoje, qual parte da sua captação você controla de verdade?",
    subtitle: "Quanto menos controle, mais difícil prever o próximo mês.",
    options: [
      ["A", "Quase nada, dependo de indicação e relacionamento.", { autoridade: 4 }],
      ["B", "Pouco, dependo muito de portal.", { portais: 4 }],
      ["C", "Tenho Instagram, mas não sei transformar isso em compradores interessados.", { estrutura: 3, anuncios: 1 }],
      ["D", "Tenho anúncios, mas não domino os números.", { anuncios: 2, otimizacao: 3 }],
      ["E", "Tenho anúncios e planilha/sistema de contatos, mas falta organização.", { otimizacao: 4 }],
      ["F", "Tenho equipe, mas não tenho visão clara por corretor ou campanha.", { escala: 4 }]
    ]
  },
  {
    id: "lead_quality",
    title: "O que mais te incomoda nos contatos que chegam hoje?",
    subtitle: "A qualidade das conversas mostra se o anúncio está chamando a pessoa certa.",
    options: [
      ["A", "Chegam poucos.", { autoridade: 2, estrutura: 2 }],
      ["B", "Chegam curiosos sem intenção real.", { anuncios: 4 }],
      ["C", "Chegam procurando imóvel fora da faixa de preço que eu vendo.", { anuncios: 2, escala: 2 }],
      ["D", "Chegam para mim e para outros corretores ao mesmo tempo.", { portais: 5 }],
      ["E", "Chegam, mas minha equipe não acompanha direito.", { escala: 4 }],
      ["F", "Eu não sei quais contatos realmente viram venda.", { otimizacao: 2, escala: 3 }]
    ]
  },
  {
    id: "tentativa",
    title: "Se você já tentou anúncios, o que exatamente foi feito?",
    subtitle: "Essa resposta ajuda a diferenciar canal ruim de execução incompleta.",
    options: [
      ["A", "Nunca tentei.", { autoridade: 2, estrutura: 3 }],
      ["B", "Impulsionei post no Instagram.", { anuncios: 4 }],
      ["C", "Rodei anúncio por conta própria por pouco tempo.", { anuncios: 4 }],
      ["D", "Contratei agência ou gestor, mas sem resultado claro.", { anuncios: 2, otimizacao: 2 }],
      ["E", "Tenho campanhas ativas hoje.", { otimizacao: 4 }],
      ["F", "Não sei exatamente o que foi feito.", { anuncios: 2, estrutura: 2 }]
    ]
  },
  {
    id: "recorte",
    title: "Quando você anuncia um imóvel, como costuma escolher quem vai ver esse anúncio?",
    subtitle: "Aqui a gente entende se o dinheiro está indo para compradores prováveis ou para gente curiosa demais.",
    options: [
      ["A", "Impulsiono para um público amplo e vejo o que acontece.", { anuncios: 4 }],
      ["B", "Escolho bairros próximos ao imóvel anunciado.", { estrutura: 2, otimizacao: 2 }],
      ["C", "Escolho regiões com renda compatível com o valor do imóvel.", { otimizacao: 4 }],
      ["D", "Separo por perfil: família, investidor, alto padrão ou lançamento.", { escala: 3, otimizacao: 2 }],
      ["E", "Quase não anuncio imóveis específicos.", { autoridade: 2, estrutura: 2 }],
      ["F", "Não sei como esse recorte é feito.", { anuncios: 3, estrutura: 2 }]
    ]
  },
  {
    id: "processo",
    title: "Hoje, quando uma pessoa interessada chama, o que acontece depois?",
    subtitle: "Comprador bom também se perde quando não existe resposta rápida e organizada.",
    options: [
      ["A", "Eu respondo pessoalmente quando consigo.", { autoridade: 2, estrutura: 2 }],
      ["B", "Alguém da equipe responde, mas sem processo claro.", { escala: 3 }],
      ["C", "A pessoa vai para WhatsApp e depois se perde.", { estrutura: 3, anuncios: 1 }],
      ["D", "Temos atendimento rápido, mas pouca qualificação.", { otimizacao: 2, escala: 2 }],
      ["E", "Temos planilha ou sistema de contatos, mas não usamos bem.", { otimizacao: 2, escala: 3 }],
      ["F", "Temos processo e queremos escalar.", { escala: 4, otimizacao: 2 }]
    ]
  },
  {
    id: "dado",
    title: "O que você olha para decidir se um anúncio imobiliário valeu a pena?",
    subtitle: "A resposta mostra se a operação está medindo vaidade ou venda de verdade.",
    options: [
      ["A", "Se muita gente chamou no WhatsApp.", { estrutura: 2, anuncios: 2 }],
      ["B", "Se vieram pessoas com poder de compra para aquele imóvel.", { otimizacao: 3 }],
      ["C", "Se gerou visita, proposta ou negociação real.", { escala: 3, otimizacao: 3 }],
      ["D", "Se o bairro anunciado trouxe contatos melhores que outros bairros.", { portais: 1, otimizacao: 3 }],
      ["E", "Se cada corretor conseguiu aproveitar os contatos recebidos.", { escala: 5 }],
      ["F", "Hoje eu não consigo medir isso direito.", { anuncios: 2, estrutura: 2 }]
    ]
  },
  {
    id: "prioridade",
    title: "Se você pudesse corrigir uma coisa nos próximos 30 dias, qual seria?",
    subtitle: "Essa escolha vira o eixo do seu plano de ação.",
    options: [
      ["A", "Aparecer para compradores certos na minha região.", { autoridade: 4 }],
      ["B", "Parar de depender tanto de portal.", { portais: 4 }],
      ["C", "Entender por que meus anúncios anteriores falharam.", { anuncios: 4 }],
      ["D", "Montar uma estrutura mínima para começar.", { estrutura: 4 }],
      ["E", "Gastar menos com curioso e falar com compradores melhores.", { otimizacao: 4 }],
      ["F", "Criar uma operação previsível para minha equipe.", { escala: 4 }]
    ]
  },
  {
    id: "valor",
    title: "Qual resultado faria você considerar que o marketing valeu a pena?",
    subtitle: "Sem esse critério, qualquer campanha vira opinião.",
    options: [
      ["A", "Receber contatos melhores que os dos portais.", { portais: 3, anuncios: 1 }],
      ["B", "Ter clareza do que deu errado antes.", { anuncios: 4 }],
      ["C", "Gerar as primeiras conversas com compradores certos em 30 dias.", { estrutura: 4 }],
      ["D", "Reduzir o dinheiro gasto com contato ruim.", { otimizacao: 4 }],
      ["E", "Ter uma tela simples com números confiáveis.", { otimizacao: 2, escala: 3 }],
      ["F", "Alimentar minha equipe com oportunidades recorrentes.", { escala: 5 }]
    ]
  }
];

const intermissions = {
  3: {
    eyebrow: "Primeiro sinal encontrado",
    button: "Continuar diagnóstico"
  },
  6: {
    eyebrow: "Ponto crítico",
    button: "Mapear processo"
  },
  8: {
    eyebrow: "Antes do plano",
    button: "Definir prioridade"
  }
};

const processPages = {
  autoridade: {
    3: {
      title: "Se a indicação ainda é sua principal fonte, o risco é invisível: você só percebe quando o mês seca.",
      body: "Quando o comprador pesquisa antes de pedir referência, ele encontra quem aparece primeiro. Nosso processo começa transformando sua reputação em uma presença local que trabalha mesmo quando você não está em uma conversa.",
      focus: "Como a VM ajuda",
      bullets: [
        "Criamos uma página simples mostrando sua região de atuação, padrão dos imóveis e diferenciais.",
        "Montamos anúncios para pessoas que pesquisam imóveis nos bairros onde você quer ser encontrado.",
        "Mantemos seu atendimento consultivo como centro da venda; o digital só coloca mais pessoas certas na conversa."
      ]
    },
    6: {
      title: "Para quem vende pelo relacionamento, o anúncio precisa passar confiança antes do WhatsApp.",
      body: "A estrutura precisa preservar seu jeito de vender. Por isso, antes de colocar dinheiro em anúncio, a VM organiza mensagem, página de apresentação e perguntas de filtro para a pessoa chegar entendendo seu posicionamento.",
      focus: "O que montamos antes de investir",
      bullets: [
        "Mensagem baseada em autoridade, histórico e conhecimento da região.",
        "Página de apresentação com prova, regiões atendidas e tipos de imóvel.",
        "Rastreamento para saber quais buscas e regiões geram contatos melhores."
      ]
    },
    8: {
      title: "O primeiro passo não é depender menos de indicação. É criar uma segunda fonte confiável.",
      body: "No plano, indicamos qual canal deve ser testado primeiro para que você comece pequeno, com controle, sem abandonar o que já funciona.",
      focus: "Plano inicial sugerido",
      bullets: [
        "Anúncios locais para compradores que pesquisam nos bairros onde você atua.",
        "WhatsApp com perguntas de qualificação simples.",
        "Relatório com origem das conversas, bairro de interesse e qualidade percebida."
      ]
    }
  },
  portais: {
    3: {
      title: "Se o portal entrega o mesmo contato para vários corretores, você não está comprando previsibilidade.",
      body: "Você está alugando uma vitrine compartilhada. Nosso processo cria uma rota própria para que o comprador chegue em você sem passar pela disputa de 20 ou 30 corretores.",
      focus: "Como a VM ajuda",
      bullets: [
        "Comparamos quanto você paga por contato no portal e quanto paga para trazer uma pessoa direto para você.",
        "Criamos anúncios para imóveis, regiões e faixas de preço específicas.",
        "Direcionamos o comprador para uma página e WhatsApp seus, não para uma vitrine compartilhada."
      ]
    },
    6: {
      title: "A saída dos portais não precisa ser brusca. Precisa ser medida.",
      body: "A VM costuma tratar portal como transição, não como inimigo. Primeiro criamos uma fonte própria, depois comparamos qualidade, custo e oportunidades reais.",
      focus: "O que medimos",
      bullets: [
        "Custo por conversa direta contra custo por contato disputado.",
        "Quantidade de conversas qualificadas por origem.",
        "Quais regiões e faixas de preço trazem oportunidades melhores."
      ]
    },
    8: {
      title: "Seu plano deve responder uma pergunta simples: quando vale reduzir dependência do portal?",
      body: "O resultado vai apontar o primeiro teste de captação própria para você ter dados antes de mexer em um canal que ainda pode sustentar vendas.",
      focus: "Plano inicial sugerido",
      bullets: [
        "Campanha piloto mantendo o portal como backup.",
        "Página exclusiva por tipo de imóvel ou região.",
        "Planilha simples de comparação: portal vs. captação própria."
      ]
    }
  },
  anuncios: {
    3: {
      title: "Quando só vem curioso, geralmente o problema não é o digital. É o filtro antes do clique.",
      body: "Anúncio sem escolher região, faixa de preço e perfil do imóvel chama gente demais e seleciona pouco. Nosso processo troca impulsionamento solto por uma rota clara até o WhatsApp.",
      focus: "Como a VM ajuda",
      bullets: [
        "Em vez de anunciar para a cidade inteira, criamos recortes por bairro, faixa de preço e padrão do imóvel.",
        "Separamos curioso de comprador com intenção por região, faixa de preço e mensagem.",
        "Criamos uma página simples que filtra antes do contato, em vez de mandar todo mundo direto para conversa."
      ]
    },
    6: {
      title: "A diferença não está em apertar outro botão. Está em montar o sistema inteiro.",
      body: "Antes de prometer contatos, a VM conecta anúncio, região, página do imóvel ou da região, WhatsApp e acompanhamento. Assim fica claro o que gerou conversa boa e o que precisa ser ajustado.",
      focus: "O que entra na estrutura",
      bullets: [
        "Anúncios que deixam claro bairro, faixa de preço e padrão do imóvel.",
        "Página dedicada para filtrar interesse real antes do WhatsApp.",
        "Leitura semanal de valor investido, qualidade das conversas e visitas marcadas."
      ]
    },
    8: {
      title: "Seu próximo teste precisa provar por que será diferente do anterior.",
      body: "O resultado vai organizar uma campanha piloto com menos achismo: região, tipo de imóvel, faixa de preço, critério de comprador bom e rotina de ajuste.",
      focus: "Plano inicial sugerido",
      bullets: [
        "Escolher um imóvel ou região principal para não espalhar o investimento.",
        "Anunciar primeiro para bairros e perfis com maior chance de pagar aquele valor.",
        "Separar as conversas por: curioso, comprador futuro, comprador pronto e investidor."
      ]
    }
  },
  estrutura: {
    3: {
      title: "Você não precisa começar grande. Precisa começar com a base certa.",
      body: "O erro comum é colocar dinheiro em anúncio antes de decidir qual imóvel, qual bairro e qual comprador você quer atrair. Nosso processo monta o mínimo necessário para o investimento ter leitura.",
      focus: "Como a VM ajuda",
      bullets: [
        "Definimos uma primeira oferta: região, faixa de preço, tipo de imóvel e comprador.",
        "Criamos página simples, configuração de acompanhamento e rota de WhatsApp antes da campanha.",
        "Configuramos métricas simples para você saber se o canal está validando."
      ]
    },
    6: {
      title: "Sem estrutura, a pessoa chama no WhatsApp mas você não aprende o que funcionou.",
      body: "A VM organiza o caminho do contato para cada conversa ensinar algo: qual anúncio atraiu, qual perfil respondeu e onde a venda travou.",
      focus: "O que montamos",
      bullets: [
        "Página de apresentação com pergunta de filtro e chamada clara para WhatsApp.",
        "WhatsApp com abordagem inicial pensada para alto padrão.",
        "Painel básico com contatos, origem, valor investido e qualidade percebida."
      ]
    },
    8: {
      title: "O plano certo para começar reduz o medo de errar.",
      body: "Em vez de vender uma operação enorme, o resultado mostra a menor estrutura capaz de validar captação digital para o seu momento.",
      focus: "Plano inicial sugerido",
      bullets: [
        "Campanha de 30 dias com verba controlada.",
        "Uma página e um público principal, sem dispersar verba.",
        "Revisão dos dados antes de escalar."
      ]
    }
  },
  otimizacao: {
    3: {
      title: "Se você já investe, o gargalo pode estar nos pequenos vazamentos que ninguém revisa.",
      body: "Contato fora da faixa de compra, anúncio cansado e atendimento sem controle reduzem margem aos poucos. Nosso processo começa por revisão, não por trocar tudo.",
      focus: "Como a VM ajuda",
      bullets: [
        "Separamos os anúncios por bairro, faixa de preço e tipo de comprador.",
        "Cortamos regiões e chamadas que trazem muita conversa sem poder de compra.",
        "Priorizamos ajustes que trazem comprador melhor, não só mais gente chamando."
      ]
    },
    6: {
      title: "Otimizar não é olhar número bonito. É descobrir qual anúncio vira visita.",
      body: "A VM organiza dados para entender quais anúncios geram conversas boas e quais só trazem curiosos sem poder de compra.",
      focus: "O que acompanhamos",
      bullets: [
        "Valor gasto por campanha e por perfil de imóvel.",
        "Qualidade dos contatos recebidos no WhatsApp.",
        "Ajustes semanais de região, público, foto, chamada e página."
      ]
    },
    8: {
      title: "Antes de escalar, precisamos provar onde seu dinheiro rende mais.",
      body: "O resultado vai indicar se o foco deve ser gastar menos com curioso, melhorar filtro, trocar página, ajustar anúncio ou profissionalizar acompanhamento.",
      focus: "Plano inicial sugerido",
      bullets: [
        "Mapa dos bairros e faixas de preço que mais trazem conversa boa.",
        "Plano de ajuste por prioridade: região, foto, chamada, página ou WhatsApp.",
        "Tela simples para acompanhar evolução sem depender de achismo."
      ]
    }
  },
  escala: {
    3: {
      title: "Com equipe, contato aleatório cria atrito. Oportunidade previsível cria gestão.",
      body: "Se vários corretores dependem da captação, o marketing precisa funcionar como operação comercial. Nosso processo conecta campanha, distribuição e acompanhamento.",
      focus: "Como a VM ajuda",
      bullets: [
        "Segmentamos campanhas por região, faixa de preço e perfil de comprador.",
        "Criamos rotas de entrada para distribuir contatos com critério.",
        "Medimos não só contato, mas atendimento, visita, proposta e retorno."
      ]
    },
    6: {
      title: "A pergunta principal deixa de ser 'quantos contatos vieram?' e vira 'quais viraram oportunidade?'.",
      body: "A VM estrutura uma tela de acompanhamento e uma rotina de leitura para a imobiliária saber onde investir, qual corretor aproveita melhor e qual campanha merece escala.",
      focus: "O que acompanhamos",
      bullets: [
        "Valor investido, qualidade e origem por campanha.",
        "Tempo de resposta e aproveitamento por equipe.",
        "Oportunidades geradas por tipo de imóvel e faixa de preço."
      ]
    },
    8: {
      title: "Sua operação precisa de previsibilidade antes de volume.",
      body: "O resultado vai sugerir uma estrutura para alimentar a equipe com qualidade, evitando que mais contatos virem apenas mais trabalho sem controle.",
      focus: "Plano inicial sugerido",
      bullets: [
        "Campanhas por carteira ou perfil de imóvel.",
        "Fluxo de distribuição e acompanhamento dos contatos.",
        "Relatório executivo para decisão de verba e escala."
      ]
    }
  }
};

const state = {
  step: "start",
  name: "",
  answers: [],
  intermissionsSeen: new Set()
};

const screen = document.querySelector("#screen");
const backBtn = document.querySelector("#backBtn");
const progressBar = document.querySelector("#progressBar");
const progressLabel = document.querySelector("#progressLabel");
const stepLabel = document.querySelector("#stepLabel");

function render() {
  updateProgress();
  if (state.step === "start") return renderStart();
  if (state.step === "intermission") return renderIntermission();
  if (state.step === "open") return renderOpenQuestion();
  if (state.step === "result") return renderResult();
  return renderQuestion();
}

function updateProgress() {
  const answered = state.answers.length;
  const percent = state.step === "result" ? 100 : Math.round((answered / questions.length) * 88);
  progressBar.style.width = `${percent}%`;
  progressLabel.textContent = `${percent}%`;

  if (state.step === "start") stepLabel.textContent = "Início";
  else if (state.step === "result") stepLabel.textContent = "Resultado";
  else if (state.step === "intermission") stepLabel.textContent = "Leitura";
  else if (state.step === "open") stepLabel.textContent = "Plano";
  else stepLabel.textContent = `Pergunta ${answered + 1} de ${questions.length}`;

  backBtn.disabled = state.step === "start";
}

function renderStart() {
  screen.innerHTML = `
    <span class="eyebrow">Diagnóstico em 3 minutos</span>
    <h1>Descubra onde sua captação imobiliária está vazando dinheiro.</h1>
    <p class="lead">Responda perguntas objetivas e receba uma leitura do seu perfil, do gargalo principal e da estrutura que corrige o problema.</p>
    <div class="start-grid">
      <div class="mini-card"><strong>Sem julgamento</strong><span>O diagnóstico explica o problema sem culpar tentativas anteriores.</span></div>
      <div class="mini-card"><strong>Com mecanismo</strong><span>O resultado mostra por que a solução funciona, não apenas uma promessa.</span></div>
    </div>
    <div class="form-row">
      <input class="text-input" id="nameInput" maxlength="32" placeholder="Seu primeiro nome, se quiser" />
      <button class="primary-button" id="startBtn" type="button">Começar</button>
    </div>
  `;
  document.querySelector("#startBtn").addEventListener("click", () => {
    state.name = document.querySelector("#nameInput").value.trim();
    state.step = 0;
    render();
  });
}

function renderQuestion() {
  const question = questions[state.step];
  const namePrefix = state.name && state.step === 0 ? `${state.name}, ` : "";
  screen.innerHTML = `
    <span class="eyebrow">Pergunta ${state.step + 1}</span>
    <h2>${namePrefix}${question.title}</h2>
    <p class="lead">${question.subtitle}</p>
    <div class="options">
      ${question.options.map(([key, text], index) => `
        <button class="option-button" type="button" data-index="${index}">
          <span class="option-key">${key}</span>
          <span class="option-text">${text}</span>
        </button>
      `).join("")}
    </div>
  `;
  screen.querySelectorAll(".option-button").forEach((button) => {
    button.addEventListener("click", () => chooseAnswer(Number(button.dataset.index)));
  });
}

function chooseAnswer(optionIndex) {
  const question = questions[state.step];
  const [key, text, weights] = question.options[optionIndex];
  state.answers.push({ questionId: question.id, key, text, weights });

  const nextIndex = state.step + 1;
  if (intermissions[nextIndex] && !state.intermissionsSeen.has(nextIndex)) {
    state.step = "intermission";
    state.pendingIndex = nextIndex;
  } else if (nextIndex >= questions.length) {
    state.step = "open";
  } else {
    state.step = nextIndex;
  }
  render();
}

function renderIntermission() {
  const data = getProcessPage(state.pendingIndex);
  screen.innerHTML = `
    <span class="eyebrow">${data.eyebrow}</span>
    <h2>${data.title}</h2>
    <p class="lead">${data.body}</p>
    <div class="insight-box">
      <strong>${data.focus}</strong>
      <ul class="process-list">
        ${data.bullets.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </div>
    <div class="button-row">
      <button class="primary-button" id="continueBtn" type="button">${data.button}</button>
    </div>
  `;
  document.querySelector("#continueBtn").addEventListener("click", () => {
    state.intermissionsSeen.add(state.pendingIndex);
    state.step = state.pendingIndex;
    state.pendingIndex = null;
    render();
  });
}

function getScoresFromAnswers(answers = state.answers) {
  const scores = Object.fromEntries(Object.keys(profiles).map((key) => [key, 0]));
  answers.forEach((answer) => {
    Object.entries(answer.weights).forEach(([key, value]) => {
      scores[key] += value;
    });
  });
  return scores;
}

function getLeadingProfileKey() {
  const scores = getScoresFromAnswers();
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

function getProcessPage(index) {
  const key = getLeadingProfileKey();
  const data = processPages[key][index];
  return {
    ...data,
    eyebrow: intermissions[index].eyebrow,
    button: intermissions[index].button
  };
}

function renderOpenQuestion() {
  screen.innerHTML = `
    <span class="eyebrow">Última etapa</span>
    <h2>Se a Virtual Mark corrigisse um problema primeiro, qual deveria ser?</h2>
    <p class="lead">Escreva do seu jeito. Isso entra na mensagem final para o especialista.</p>
    <textarea class="text-area" id="challengeInput" placeholder="Ex: Quero parar de depender de portal e receber contatos diretos para imóveis acima de R$ 900 mil na zona sul..."></textarea>
    <div class="button-row">
      <button class="primary-button" id="resultBtn" type="button">Ver meu diagnóstico</button>
      <button class="secondary-button" id="skipOpenBtn" type="button">Pular</button>
    </div>
  `;
  document.querySelector("#resultBtn").addEventListener("click", () => {
    state.challenge = document.querySelector("#challengeInput").value.trim();
    state.step = "result";
    render();
  });
  document.querySelector("#skipOpenBtn").addEventListener("click", () => {
    state.challenge = "";
    state.step = "result";
    render();
  });
}

function getResult() {
  const scores = getScoresFromAnswers();
  const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const totalScore = Object.values(scores).reduce((sum, value) => sum + value, 0);
  return {
    key: winner[0],
    score: Math.max(62, Math.min(96, Math.round((winner[1] / Math.max(1, totalScore)) * 100))),
    scores
  };
}

function renderResult() {
  const result = getResult();
  const profile = profiles[result.key];
  const challenge = state.challenge || "receber contatos melhores para imóveis de alto padrão, sem depender só de portal ou indicação";

  screen.innerHTML = `
    <div class="result-header">
      <div>
        <span class="eyebrow">${profile.tag}</span>
        <h2>Seu perfil: ${profile.title}</h2>
        <p class="lead">${profile.headline}</p>
      </div>
      <div class="score-badge">
        <span>Aderência</span>
        <strong>${result.score}%</strong>
      </div>
    </div>

    <div class="diagnosis-grid">
      <div class="diagnosis-item"><span>Gargalo provável</span><strong>${profile.diagnosis}</strong></div>
      <div class="diagnosis-item"><span>Como resolver</span><strong>${profile.mechanism}</strong></div>
      <div class="diagnosis-item"><span>Sua prioridade</span><strong>${challenge}</strong></div>
    </div>

    <h3>Seus próximos passos</h3>
    <ul class="steps-list">
      ${profile.nextSteps.map((step, index) => `<li><span>${index + 1}</span><p>${step}</p></li>`).join("")}
    </ul>

    <div class="lead-form">
      <h3>Transformar diagnóstico em conversa objetiva</h3>
      <p>Envie este resumo para a Virtual Mark e receba uma leitura do que montar primeiro: regiões, anúncios, página de apresentação, WhatsApp e acompanhamento das conversas.</p>
      <div class="form-row">
        <input class="text-input" id="emailInput" type="email" placeholder="Seu e-mail" />
        <input class="text-input" id="phoneInput" type="tel" placeholder="WhatsApp com DDD" />
      </div>
      <button class="primary-button" id="whatsappBtn" type="button">${profile.cta}</button>
    </div>
    <div class="button-row">
      <button class="secondary-button" id="restartBtn" type="button">Refazer diagnóstico</button>
    </div>
  `;

  document.querySelector("#whatsappBtn").addEventListener("click", () => {
    const name = state.name || "Contato";
    const email = document.querySelector("#emailInput").value.trim() || "não informado";
    const phone = document.querySelector("#phoneInput").value.trim() || "não informado";
    const text = `Olá, Virtual Mark!\n\nMeu nome: ${name}\nPerfil do diagnóstico: ${profile.title}\nPrioridade: ${challenge}\nE-mail: ${email}\nWhatsApp: ${phone}\n\nQuero entender qual estrutura corrige esse gargalo primeiro.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  });

  document.querySelector("#restartBtn").addEventListener("click", () => {
    state.step = "start";
    state.name = "";
    state.answers = [];
    state.challenge = "";
    state.intermissionsSeen = new Set();
    render();
  });
}

backBtn.addEventListener("click", () => {
  if (state.step === "result") {
    state.step = "open";
  } else if (state.step === "open") {
    state.step = questions.length - 1;
  } else if (state.step === "intermission") {
    if (state.answers.length) state.answers.pop();
    state.step = Math.max(0, state.pendingIndex - 1);
    state.pendingIndex = null;
  } else if (typeof state.step === "number") {
    if (state.answers.length) state.answers.pop();
    state.step = state.step <= 0 ? "start" : state.step - 1;
  }
  render();
});

render();
