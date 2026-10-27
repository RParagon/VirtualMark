import {
  Bell, Building2, ClipboardCheck, FileText, Hammer, MessageCircle, PanelTop, Plug,
  Receipt, Search, ShieldCheck, Siren, Sun, Users, Wrench, Zap, Award, Gauge, FileCheck2, Landmark,
  AirVent, Blinds, ChefHat, Lightbulb, LockKeyhole, Calculator as CalculatorIcon, Settings2,
} from "lucide-react";
import { galleryImages } from "@/data/gallery";
import heroImg from "@/assets/hero-engineer.webp";
import solarImg from "@/assets/portfolio-solar.webp";
import panelImg from "@/assets/portfolio-panel.webp";
import condoImg from "@/assets/portfolio-condo.webp";
import installImg from "@/assets/portfolio-install.webp";
import type { LpConfig } from "./landing-page";

const pick = (nums: number[]) => nums.map((n) => galleryImages[n - 1]).filter(Boolean);
const captioned = (items: [number, string][]) =>
  items.flatMap(([n, title]) => (galleryImages[n - 1] ? [{ ...galleryImages[n - 1], alt: title, title }] : []));

// Mesmos logos da seção "Clientes e parceiros" da home
const logos = [
  { src: "/cliente-hcc.webp", alt: "HCC Grupo", width: 217, height: 84 },
  { src: "/cliente-press.webp", alt: "PRESS Engenharia", width: 264, height: 84 },
  { src: "/cliente-prolux.webp", alt: "PROLUX", width: 383, height: 84 },
  { src: "/cliente-solis.webp", alt: "Solis Engenharia Elétrica", width: 317, height: 84 },
  { src: "/logo-weg.webp", alt: "WEG", width: 119, height: 84 },
  { src: "/logo-fronius.webp", alt: "Fronius", width: 296, height: 84 },
  { src: "/logo-growatt.webp", alt: "Growatt", width: 344, height: 84 },
  { src: "/logo-soliens.webp", alt: "Soliens", width: 354, height: 84 },
];


export const eletricistaLp: LpConfig = {
  title: "Eletricista em Porto Alegre com CREA e ART | WB Soluções Elétricas",
  description:
    "Eletricista em Porto Alegre: instalações, quadros de distribuição, padrões de entrada, manutenção e atendimento emergencial. CREA, ART, NBR 5410 e nota fiscal. Peça pelo WhatsApp.",
  hero: {
    badge: "Atendimento direto pelo WhatsApp · Porto Alegre",
    titleStart: "Eletricista em Porto Alegre com",
    titleEm: "engenharia",
    titleEnd: " e ART.",
    lead: "Instalações, quadros de distribuição, padrões de entrada, manutenção e atendimento emergencial — executados por equipe própria, conforme NBR 5410 e NR10, com nota fiscal em todos os serviços.",
    checks: [
      "Você fala direto com quem executa, sem intermediários",
      "Engenheiro responsável e ART pelo CREA quando o serviço exige",
      "Atendimento emergencial, inclusive aos finais de semana",
    ],
    primary: { label: "Pedir orçamento", message: "Olá! Vim pelo site e quero um orçamento de serviço elétrico." },
    secondary: { label: "Atendimento emergencial", message: "Olá! Preciso de um eletricista com urgência.", icon: Siren },
    stats: [
      { value: "9", suffix: "anos", label: "de atuação técnica" },
      { value: "100", suffix: "%", label: "dos serviços com NF" },
      { value: "POA", label: "e região metropolitana" },
    ],
    image: heroImg,
    imageAlt: "Engenheiro eletricista da WB trabalhando em painel elétrico",
    chips: [
      { icon: Award, title: "ART pelo CREA", sub: "Engenheiro responsável" },
      { icon: Receipt, title: "Nota fiscal", sub: "em todos os serviços" },
    ],
  },
  logos,
  services: {
    eyebrow: "Serviços",
    title: "Do reparo simples à obra completa.",
    lead: "Cada serviço é entregue com diagnóstico claro, material adequado e execução dentro das normas técnicas.",
    items: [
      { icon: Zap, title: "Instalações residenciais", desc: "Projetos e execução de instalações elétricas residenciais conforme NBR 5410.", message: "Olá! Quero um orçamento de instalação elétrica residencial." },
      { icon: Building2, title: "Elétrica predial e condomínios", desc: "Infraestrutura elétrica completa para edifícios e condomínios residenciais e comerciais.", message: "Olá! Quero um orçamento de elétrica predial / condomínio." },
      { icon: PanelTop, title: "Quadros de distribuição", desc: "Montagem e modernização de quadros de distribuição e comando.", message: "Olá! Quero um orçamento de quadro de distribuição." },
      { icon: Plug, title: "Padrões de entrada", desc: "Execução e adequação de padrões de entrada conforme a concessionária local.", message: "Olá! Quero um orçamento de padrão de entrada." },
      { icon: Wrench, title: "Manutenção preventiva e corretiva", desc: "Planos de manutenção que previnem falhas e prolongam a vida útil da instalação.", message: "Olá! Quero um orçamento de manutenção elétrica." },
      { icon: ShieldCheck, title: "SPDA (instalação)", desc: "Instalação de sistemas de proteção contra descargas atmosféricas (sem emissão de laudo).", message: "Olá! Quero um orçamento de instalação de SPDA." },
      { icon: Bell, title: "Sistemas de alarme", desc: "Instalação e manutenção de sistemas de alarme para residências e estabelecimentos.", message: "Olá! Quero um orçamento de sistema de alarme." },
      { icon: Sun, title: "Energia solar fotovoltaica", desc: "Dimensionamento, instalação e manutenção de sistemas fotovoltaicos.", message: "Olá! Quero um orçamento de energia solar." },
    ],
  },
  steps: {
    title: "Do primeiro contato ao serviço entregue.",
    lead: "Quatro etapas simples, com a mesma equipe do início ao fim.",
    items: [
      { icon: MessageCircle, title: "Contato no WhatsApp", desc: "Você descreve o problema ou o serviço e envia fotos do local.", tag: "direto com a WB" },
      { icon: Search, title: "Diagnóstico", desc: "Avaliamos as fotos ou fazemos a visita técnica para entender a instalação.", tag: "sem rodeios" },
      { icon: FileText, title: "Orçamento detalhado", desc: "Valor, material e prazo por escrito antes de começar.", tag: "por escrito" },
      { icon: Hammer, title: "Execução e entrega", desc: "Serviço feito conforme as normas, com nota fiscal e ART quando aplicável.", tag: "com NF" },
    ],
    foot: "Orçamento por escrito e nota fiscal em todos os serviços.",
    cta: { label: "Pedir orçamento no WhatsApp", message: "Olá! Vim pelo site e quero um orçamento de serviço elétrico." },
  },
  audience: {
    title: "Da sua casa ao condomínio inteiro.",
    items: [
      { img: installImg, alt: "Instalação elétrica residencial", cat: "Residencial", title: "Casas e apartamentos", desc: "Troca de fiação, novos circuitos, chuveiro, ar-condicionado e adequação do quadro." },
      { img: condoImg, alt: "Instalação elétrica em condomínio", cat: "Predial", title: "Condomínios", desc: "Áreas comuns, prumadas, medidores e manutenção periódica com acompanhamento técnico." },
      { img: panelImg, alt: "Quadro de distribuição comercial", cat: "Comercial", title: "Comércios e empresas", desc: "Instalações que aguentam a carga do negócio, sem parar a operação por falha elétrica." },
    ],
  },
  gallery: {
    title: "Obras da WB",
    // quadros, padrões de entrada, medição e instalações
    images: pick([25, 27, 26, 33, 12, 13, 14, 15, 22, 46, 47, 48, 49, 50, 51, 52, 36, 2]),
  },
  trust: {
    eyebrow: "Garantia e documentação",
    title: "Serviço feito do jeito certo, com tudo no papel.",
    lead: "Do orçamento à entrega, você sabe o que vai ser feito, com qual material e por quem.",
    points: [
      "Garantia nos serviços executados, do início ao fim",
      "Nota fiscal em 100% dos serviços",
      "ART pelo CREA nos projetos",
      "Execução conforme NBR 5410 e NR10",
    ],
    cta: { label: "Pedir orçamento", message: "Olá! Vim pelo site e quero um orçamento de serviço elétrico." },
  },
  location: "Porto Alegre e região · RS",
  faq: {
    lead: "Tire suas dúvidas sobre serviços, atendimento e normas da WB Soluções Elétricas.",
    items: [
      { q: "A WB atende emergências em finais de semana?", a: "Sim. Atendemos emergências inclusive aos sábados, domingos e feriados. Descreva o problema pelo WhatsApp e, se possível, envie uma foto do quadro para agilizar o diagnóstico." },
      { q: "Quais normas técnicas a WB segue nas instalações?", a: "Todos os serviços são executados conforme a NBR 5410 (instalações de baixa tensão) e a NR10 (segurança em eletricidade). Emitimos ART (Anotação de Responsabilidade Técnica) pelo CREA nos projetos." },
      { q: "A WB emite nota fiscal?", a: "Sim. Emitimos nota fiscal para 100% dos serviços, garantindo transparência e segurança jurídica. CNPJ 53.522.809/0001-40." },
      { q: "Quanto tempo leva para receber um orçamento?", a: "Entramos em contato em horário comercial para alinhar os detalhes. Pelo WhatsApp, com fotos do local, o processo costuma ser bem mais rápido." },
      { q: "Meu disjuntor desarma toda hora. É perigoso?", a: "Pode ser sinal de sobrecarga, curto-circuito ou fuga de corrente. O disjuntor está fazendo o trabalho dele; o problema é a causa. Evite religar repetidamente e chame um eletricista para avaliar o circuito." },
      { q: "Vocês trocam o padrão de entrada junto com a concessionária?", a: "Executamos e adequamos padrões de entrada conforme as exigências da concessionária local." },
    ],
  },
  final: {
    title: "Precisa de uma solução elétrica segura e profissional?",
    lead: "Atendimento completo pelo WhatsApp — inclusive aos finais de semana. Fale com a WB Soluções Elétricas agora mesmo.",
    cta: { label: "WhatsApp", message: "Olá! Vim pelo site e preciso de um eletricista." },
  },
  stickyLabel: "Chamar eletricista no WhatsApp",
};

/** LP solar original (CTAs de WhatsApp). Base do simulador e da versão com captura. */
const solarWhatsLp: LpConfig = {
  title: "Energia solar em Porto Alegre com projeto e ART | WB Soluções Elétricas",
  description:
    "Energia solar em Porto Alegre: projeto de engenharia com ART, instalação por equipe própria e acompanhamento da homologação. Mande a foto da sua conta de luz pelo WhatsApp.",
  hero: {
    badge: "Energia solar · Porto Alegre",
    titleStart: "Energia solar em Porto Alegre com",
    titleEm: "projeto de engenharia",
    titleEnd: " e ART.",
    lead: "Reduza sua conta de luz com um sistema dimensionado para o seu consumo — projeto, instalação e homologação feitos pela nossa própria equipe, do telhado ao quadro elétrico.",
    checks: [
      "Projeto assinado por engenheiro, com ART e conforme NBR 5410",
      "Equipe própria de instalação — sem terceirizar sua obra",
      "Cuidamos da homologação com a distribuidora",
    ],
    primary: {
      label: "Falar com um especialista",
      message: "Olá! Quero receber uma proposta de energia solar. Vou enviar a foto da minha conta de luz.",
    },
    stats: [
      { value: "9", suffix: "anos", label: "de atuação técnica" },
      { value: "5", suffix: "MW", label: "supervisão de usinas solares" },
      { value: "100", suffix: "%", label: "dos serviços com NF" },
    ],
    image: solarImg,
    imageAlt: "Sistema de energia solar fotovoltaica instalado pela WB",
    chips: [
      { icon: Award, title: "Projeto com ART", sub: "Engenheiro responsável" },
      { icon: Users, title: "Equipe própria", sub: "NR-10 · NR-35" },
    ],
  },
  logos,
  services: {
    eyebrow: "O que fazemos",
    title: "Do projeto à manutenção, numa só equipe.",
    lead: "Um único responsável técnico do primeiro contato até o sistema gerando.",
    items: [
      { icon: Gauge, title: "Projeto e dimensionamento", desc: "Sistema dimensionado pelo seu consumo de energia, com documentação técnica e proposta comercial.", message: "Olá! Quero um projeto de energia solar. Vou enviar a foto da minha conta de luz." },
      { icon: Sun, title: "Instalação", desc: "Equipe própria responsável pela instalação e montagem de estrutura, módulos e inversores, conforme NBR 5410.", message: "Olá! Quero um orçamento de instalação de energia solar." },
      { icon: FileCheck2, title: "Homologação do projeto", desc: "Acompanhamento da aprovação do seu projeto junto à concessionária de energia até o início da operação do seu sistema solar.", message: "Olá! Quero saber como funciona a homologação do sistema solar." },
      { icon: Wrench, title: "Limpeza e manutenção preventiva", desc: "Revisão elétrica, correção de falhas, verificação de conexões, reaperto de parafusos e limpeza do sistema fotovoltaico.", message: "Olá! Preciso de manutenção em um sistema de energia solar." },
    ],
  },
  steps: {
    title: "Da sua conta de luz ao sistema gerando.",
    lead: "Cinco etapas, uma única equipe responsável do primeiro contato até a troca do medidor.",
    items: [
      { icon: Receipt, title: "Análise da conta", desc: "Você envia uma foto da conta no WhatsApp e avaliamos seu consumo.", tag: "pelo WhatsApp" },
      { icon: Search, title: "Visita técnica", desc: "Medimos o telhado, a sombra e a instalação elétrica existente.", tag: "no local" },
      { icon: ClipboardCheck, title: "Projeto e ART", desc: "Dimensionamento, proposta final e documentação técnica.", tag: "por escrito" },
      { icon: Hammer, title: "Instalação", desc: "Equipe própria instala e monta estrutura, módulos e inversores.", tag: "equipe própria" },
      { icon: Landmark, title: "Homologação", desc: "Aprovação do projeto junto à concessionária até o sistema entrar em operação.", tag: "com a distribuidora" },
    ],
    foot: "Você acompanha cada etapa pelo WhatsApp, com um responsável técnico da WB.",
    cta: { label: "Começar pela análise da conta", message: "Olá! Quero começar pela análise da minha conta de luz para energia solar." },
  },
  audience: {
    title: "Um projeto para cada tipo de consumo.",
    items: [
      { img: galleryImages[27].src, alt: "Telhado residencial com módulos solares instalados pela WB", cat: "Residencial", title: "Residências", desc: "Para quem sente o peso do chuveiro, do ar-condicionado e do aquecedor no inverno gaúcho." },
      { img: galleryImages[19].src, alt: "Cobertura comercial com módulos solares", cat: "Comercial", title: "Comércios e empresas", desc: "Conta de luz vira custo previsível e sobra mais margem no fim do mês." },
      { img: solarImg, alt: "Usina solar de grande porte", cat: "Grande porte", title: "Usinas e obras maiores", desc: "Experiência na supervisão simultânea de duas usinas de 5 MW no Mato Grosso do Sul." },
    ],
  },
  gallery: {
    title: "Sistemas instalados pela WB",
    // módulos em telhados, inversores e proteções — legenda diz o que a foto mostra
    images: captioned([
      [3, "Módulos em cobertura de prédio"],
      [4, "Módulos em telhado residencial"],
      [8, "Módulos em telhado de fibrocimento"],
      [20, "Estrutura elevada em laje"],
      [21, "Estrutura elevada em laje"],
      [28, "Sistema residencial em telhado cerâmico"],
      [31, "Módulos em telhado cerâmico"],
      [32, "Módulos em telhado cerâmico"],
      [34, "Sistema residencial em telhado cerâmico"],
      [35, "Reaperto das fixações dos módulos"],
      [38, "Limpeza dos módulos"],
      [42, "Estrutura elevada com módulos"],
      [43, "Módulos em laje comercial"],
      [44, "Limpeza dos módulos"],
      [2, "Inversor e quadro de proteção"],
      [36, "Instalação do inversor"],
      [46, "Conexões do inversor"],
    ]),
  },
  trust: {
    eyebrow: "Por que a WB",
    title: "Engenharia de verdade no seu telhado.",
    lead: "Energia solar é projeto elétrico: quem assina precisa responder por ele. Na WB, você sabe quem é o responsável técnico e tem tudo por escrito.",
    points: [
      "Engenheiro responsável e ART pelo CREA",
      "Execução conforme NBR 5410 e NR10",
      "Equipe própria — a mesma do projeto à instalação",
      "Experiência em usinas de 5 MW, com os mesmos cuidados no seu sistema",
      "Nota fiscal em 100% dos serviços",
    ],
    cta: { label: "Pedir minha proposta", message: "Olá! Quero receber uma proposta de energia solar. Vou enviar a foto da minha conta de luz." },
  },
  location: "Porto Alegre · RS",
  faq: {
    lead: "As dúvidas mais comuns sobre energia solar, regras da distribuidora e o nosso processo.",
    items: [
      { q: "Com a Lei 14.300, energia solar ainda compensa?", a: "Sim. A lei passou a cobrar gradualmente uma parte do uso da rede sobre a energia injetada, mas o retorno segue atrativo na maioria dos casos. Na proposta, mostramos a economia já considerando as regras atuais." },
      { q: "Funciona no inverno gaúcho e em dias nublados?", a: "Funciona. A geração cai em dias nublados e nos meses de inverno, e sobe no verão. O sistema é dimensionado pela média do ano, e o excedente de um mês vira crédito para os meses de menor geração." },
      { q: "Minha conta vai zerar?", a: "Não. Continua existindo o custo mínimo cobrado pela distribuidora e a iluminação pública. O objetivo é reduzir ao máximo o restante da conta." },
      { q: "Meu telhado serve?", a: "A maioria dos telhados de telha cerâmica, fibrocimento, metálico e lajes serve. Na visita técnica avaliamos estrutura, inclinação e sombreamento. Se não for viável, dizemos." },
      { q: "Precisa de manutenção?", a: "Sim, e vai além da limpeza. A manutenção preventiva inclui revisão elétrica, verificação de conexões, reaperto de parafusos, correção de falhas e limpeza dos módulos. Entre uma visita e outra, você acompanha a geração pelo aplicativo do inversor." },
      { q: "Quanto tempo até começar a gerar?", a: "O prazo depende do porte do sistema e, principalmente, da análise e da vistoria da distribuidora, que acompanhamos do início ao fim." },
      { q: "A distribuidora pode barrar a conexão?", a: "Em alguns trechos da rede a distribuidora pode exigir estudos ou adequações. Avaliamos isso já no projeto e cuidamos da tramitação para você não ficar sem resposta." },
    ],
  },
  final: {
    title: "Mande uma foto da sua conta. A gente faz as contas.",
    lead: "Sem compromisso: você recebe uma estimativa de sistema pelo WhatsApp, feita por quem assina o projeto.",
    cta: { label: "Quero minha proposta", message: "Olá! Quero receber uma proposta de energia solar. Vou enviar a foto da minha conta de luz." },
  },
  stickyLabel: "Quero minha proposta no WhatsApp",
};

const GUIA = "Quero o guia grátis";

/**
 * LP solar dos anúncios (/energia-solar): captura por formulário em troca do Guia WB da
 * Energia Solar 2026 (PDF). Sem WhatsApp na página; a WB chama o lead pelo telefone do formulário.
 */
export const solarLp: LpConfig = {
  ...solarWhatsLp,
  description:
    "Energia solar em Porto Alegre com projeto de engenharia e ART. Baixe grátis o guia completo: Lei 14.300 em 2026, como ler a conta, quanto sistema você precisa e 12 perguntas antes de assinar.",
  hero: {
    ...solarWhatsLp.hero,
    badge: "Guia gratuito · Energia solar em Porto Alegre",
    lead: "Antes de pedir orçamento, entenda o que muda na sua conta. Baixe o guia completo da WB: escrito por quem projeta, instala e homologa sistemas no Rio Grande do Sul.",
    checks: [
      "A Lei 14.300 em 2026, sem letra miúda",
      "Como ler a sua conta e calcular o sistema ideal",
      "12 perguntas para não cair em projeto amador",
    ],
    primary: { label: GUIA, message: "" },
  },
  capture: { cta: GUIA, link: "Receber o guia" },
  steps: {
    ...solarWhatsLp.steps,
    items: [
      { icon: Receipt, title: "Análise da conta", desc: "Avaliamos o histórico de consumo da sua conta de luz e o tipo de ligação.", tag: "sem compromisso" },
      ...solarWhatsLp.steps.items.slice(1),
    ],
    foot: "Um responsável técnico da WB acompanha cada etapa, do projeto à troca do medidor.",
    cta: { label: "Baixar o guia grátis", message: "" },
  },
  trust: { ...solarWhatsLp.trust, cta: { label: GUIA, message: "" } },
  final: {
    title: "Antes de investir, leia o guia. É grátis.",
    lead: "Lei 14.300, conta de luz, dimensionamento, telhado, equipamentos e um comparador de orçamentos. Em PDF, no seu e-mail, em menos de um minuto.",
    cta: { label: "Baixar o guia grátis", message: "" },
  },
  stickyLabel: "Baixar o guia grátis",
};

/** Rascunho para validação: mesma LP solar, com o simulador no topo. Rota própria para não mexer na LP com anúncio rodando. */
export const solarSimuladorLp: LpConfig = {
  ...solarWhatsLp,
  calculator: { kind: "solar", cta: "Simular meu sistema" },
};

// Só os clientes: os parceiros da lista geral são marcas de energia solar.
const clientLogos = logos.slice(0, 4);

const AUTOMACAO_MSG = "Olá! Vim pelo site e quero saber mais sobre automação residencial.";

/**
 * LP de automação residencial com o simulador e o WhatsApp (versão anterior à captura).
 * Conteúdo tirado do estudo de custos e das mensagens do grupo de 07/10/2026;
 * sem fotos (ainda não há obras de automação no acervo) e sem números inventados.
 */
const automacaoWhatsLp: LpConfig = {
  title: "Automação residencial em Porto Alegre | WB Soluções Elétricas",
  description:
    "Automação residencial em Porto Alegre: luzes, persianas, ar-condicionado, TV e fechadura no celular. Simule o pacote ideal para a sua casa em menos de 1 minuto.",
  hero: {
    badge: "Automação residencial · Porto Alegre",
    titleStart: "Sua casa no",
    titleEm: "celular",
    titleEnd: ", sem quebrar parede.",
    lead: "Luzes, persianas, ar-condicionado, TV e fechadura comandados pelo app ou pela voz. Instalado por quem entende da parte elétrica, que é onde a automação costuma dar problema.",
    checks: [
      "Simule em 1 minuto e veja o pacote ideal para a sua casa",
      "Casa pronta ou em obra: indicamos o caminho certo para cada caso",
      "Equipe própria de engenharia elétrica, com nota fiscal",
    ],
    primary: { label: "Falar no WhatsApp", message: AUTOMACAO_MSG },
    // Pexels (licença livre p/ uso comercial): "Modern smart lamp illuminated on desk", loop com crossfade
    video: { src: "/automacao-loop.mp4", poster: "/automacao-loop-poster.webp", playbackRate: 0.75 },
    stats: [
      { value: "9", suffix: "anos", label: "de atuação técnica" },
      { value: "100", suffix: "%", label: "dos serviços com NF" },
      { value: "POA", label: "Porto Alegre" },
    ],
  },
  calculator: { kind: "automacao", cta: "Simular minha casa" },
  logos: clientLogos,
  services: {
    eyebrow: "O que dá para automatizar",
    title: "Comece por um cômodo. Amplie quando quiser.",
    lead: "Cada item funciona sozinho e conversa com os outros. Dá para começar pequeno e crescer sem trocar nada.",
    items: [
      { icon: Lightbulb, title: "Iluminação", desc: "Interruptores inteligentes no lugar dos atuais, com cenas e horários. Apague tudo com um toque.", message: "Olá! Quero automatizar a iluminação da minha casa." },
      { icon: AirVent, title: "Ar-condicionado e TV", desc: "Um único controle por ambiente comanda o ar e a TV pelo celular. Ligue o ar antes de chegar em casa.", message: "Olá! Quero automatizar ar-condicionado e TV." },
      { icon: Blinds, title: "Persianas motorizadas", desc: "Motorização da persiana que você já tem ou persiana nova sob medida, abrindo e fechando no horário.", message: "Olá! Quero motorizar persianas." },
      { icon: LockKeyhole, title: "Fechadura digital", desc: "Senha, biometria e acesso pelo app. Libere a entrada de alguém sem precisar estar em casa.", message: "Olá! Quero instalar uma fechadura digital." },
      { icon: ChefHat, title: "Cozinha inteligente", desc: "Sensor de vazamento de gás, tomadas inteligentes e iluminação sob o armário com sensor.", message: "Olá! Quero automatizar a cozinha." },
      { icon: Hammer, title: "Pré-automação para obra", desc: "Vai construir ou reformar? Deixamos neutro, tomadas e rede prontos agora, para automatizar sem quebrar depois.", message: "Olá! Estou em obra/reforma e quero deixar a casa preparada para automação." },
      { icon: Settings2, title: "Cenas e rotinas", desc: "Cinema, dormir, sair de casa: um toque ajusta luzes, persianas e ar de uma vez.", message: "Olá! Quero saber como funcionam as cenas de automação." },
      { icon: MessageCircle, title: "Suporte depois da instalação", desc: "Ajustes de cenas e suporte remoto depois de tudo instalado, para a automação continuar funcionando.", message: "Olá! Quero saber sobre o suporte de automação." },
    ],
  },
  steps: {
    title: "Da simulação à casa automatizada.",
    lead: "Uma única equipe, da visita técnica às cenas configuradas no seu celular.",
    items: [
      { icon: CalculatorIcon, title: "Simulação", desc: "Você escolhe o que quer automatizar e recebe o pacote indicado no WhatsApp.", tag: "pelo site" },
      { icon: Search, title: "Visita técnica", desc: "Conferimos neutro nos interruptores, Wi-Fi nos cômodos e tomadas perto das janelas.", tag: "no local" },
      { icon: FileText, title: "Proposta por escrito", desc: "Equipamentos, mão de obra e prazo detalhados antes de começar.", tag: "por escrito" },
      { icon: Hammer, title: "Instalação e cenas", desc: "Instalamos, configuramos as cenas e ensinamos a usar no app e por voz.", tag: "equipe própria" },
    ],
    foot: "A visita técnica antes do orçamento evita surpresa no meio da instalação.",
    cta: { label: "Falar com a WB", message: AUTOMACAO_MSG },
  },
  trust: {
    eyebrow: "Por que a WB",
    title: "Automação começa na instalação elétrica.",
    lead: "Interruptor inteligente sem neutro, persiana sem tomada perto e Wi-Fi fraco são os problemas mais comuns. Uma empresa de engenharia elétrica resolve a base antes de instalar a tecnologia.",
    points: [
      "Visita técnica antes do orçamento: neutro, Wi-Fi e tomadas conferidos",
      "Equipe própria, conforme NBR 5410 e NR10",
      "Nota fiscal em 100% dos serviços",
      "Dá para começar pequeno e ampliar depois",
    ],
    cta: { label: "Falar com a WB", message: AUTOMACAO_MSG },
  },
  location: "Porto Alegre · RS",
  faq: {
    lead: "As dúvidas mais comuns de quem está pensando em automatizar a casa.",
    items: [
      { q: "Precisa quebrar parede?", a: "Na maioria das casas prontas, não. Os interruptores inteligentes entram no lugar dos atuais. O ponto de atenção é o fio neutro na caixa do interruptor, que conferimos na visita técnica." },
      { q: "Funciona com Alexa?", a: "Sim. Os pacotes funcionam pelo aplicativo e por comando de voz." },
      { q: "E se a internet cair?", a: "Depende da linha. A linha Wi-Fi usa a rede da casa e sente quando ela falha. A linha com central (Zigbee) é mais estável e não pesa no roteador. Explicamos a diferença antes de você escolher." },
      { q: "Posso começar só com um cômodo?", a: "Pode. Dá para começar pelo ar e pela TV, ou pelas luzes da sala, e ampliar depois." },
      { q: "Vou construir ou reformar. O que preciso preparar?", a: "Fio neutro nas caixas dos interruptores, tomada perto de cada janela que vai ter persiana e cabo de rede nos cômodos principais. É a pré-automação: custa pouco na obra e evita quebrar parede depois." },
      { q: "Já tenho persiana. Precisa trocar?", a: "Nem sempre. Em muitos casos dá para motorizar a persiana existente. Quando não dá, indicamos uma nova sob medida." },
    ],
  },
  final: {
    title: "Simule agora e receba o pacote ideal no WhatsApp.",
    lead: "Sem compromisso: você escolhe o que quer automatizar e a gente responde com o caminho certo para a sua casa.",
    cta: { label: "WhatsApp", message: AUTOMACAO_MSG },
  },
  stickyLabel: "Falar no WhatsApp",
};

const GUIA_CASA = "Quero o guia grátis";

/**
 * LP de automação (/automacao) no mesmo modelo da solar: captura por formulário em troca do
 * Guia WB da Casa Inteligente 2026 (PDF), com o simulador como personalização opcional.
 * Sem WhatsApp na página; a WB chama o lead pelo telefone do formulário.
 */
export const automacaoLp: LpConfig = {
  ...automacaoWhatsLp,
  description:
    "Automação residencial em Porto Alegre com projeto elétrico e equipe própria. Baixe grátis o guia completo: Wi-Fi ou Zigbee, o que conferir na parte elétrica, o que preparar na obra e 12 perguntas antes de contratar.",
  hero: {
    ...automacaoWhatsLp.hero,
    badge: "Guia gratuito · Automação residencial em Porto Alegre",
    lead: "Antes de comprar o primeiro interruptor inteligente, entenda o que a sua casa precisa. Baixe o guia completo da WB, escrito por quem instala a parte elétrica, que é onde a automação costuma dar problema.",
    checks: [
      "Wi-Fi ou Zigbee: qual linha faz sentido para a sua casa",
      "Casa pronta ou em obra: o que preparar para não quebrar parede",
      "12 perguntas para não cair em instalação amadora",
    ],
    primary: { label: GUIA_CASA, message: "" },
  },
  calculator: undefined,
  capture: { guia: "automacao", cta: GUIA_CASA, link: "Receber o guia" },
  steps: {
    ...automacaoWhatsLp.steps,
    title: "Do guia à casa automatizada.",
    items: [
      { icon: FileText, title: "Guia e simulação", desc: "Você baixa o guia e, se quiser, responde 4 perguntas para receber o pacote indicado para a sua casa.", tag: "pelo site" },
      ...automacaoWhatsLp.steps.items.slice(1),
    ],
    cta: { label: "Baixar o guia grátis", message: "" },
  },
  trust: { ...automacaoWhatsLp.trust, cta: { label: GUIA_CASA, message: "" } },
  final: {
    title: "Antes de automatizar, leia o guia. É grátis.",
    lead: "Wi-Fi ou Zigbee, a base elétrica, cômodo por cômodo, pré-automação para obra e um planejador para preencher. Em PDF, no seu e-mail, em menos de um minuto.",
    cta: { label: "Baixar o guia grátis", message: "" },
  },
  stickyLabel: "Baixar o guia grátis",
};
