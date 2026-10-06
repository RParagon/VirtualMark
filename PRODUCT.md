# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Donos e gestores de pequenos e médios negócios no Brasil (profissionais autônomos, comércio local, e-commerce, imobiliárias, serviços), em geral chegando por anúncio no celular. Muitos estão começando: não têm logo, site nem presença digital. A home precisa falar com todos, por estágio (ser encontrado, vender mais, escalar com dados) e não por segmento. Leads de pessoa física sem fit não compensam, então a home deve qualificar antes do WhatsApp.

## Product Purpose
VirtualMark é uma agência de crescimento que entrega o negócio no ar ponta a ponta: branding, site, Google Meu Negócio, criativos (com IA), tráfego pago, rastreio de origem (gclid) e conteúdo. A home serve como página de conversão (leva à consultoria/diagnóstico) e como portfólio (cases e processo). Sucesso: o visitante entende que não é "só tráfego" e pede consultoria.

## Positioning
"Você chega com uma ideia. Sai com o negócio no ar." Estrutura completa em poucos dias (campanha no ar em menos de 7 dias, às vezes menos) e rastreio do clique à venda (gclid) para entender o lead a longo prazo. Tecnologia própria: sites, quizzes por ICP, simulador, painel de leads com atribuição de origem, prerender para GEO. Frase de apoio possível: "Do clique à venda, a gente enxerga tudo." (a confirmar com o usuário).

## Operating Context
- Criativos: foto do produto + modelo no ChatGPT, que gera o storyboard; depois Google Flow gera o vídeo com IA (prompt + storyboard). Narração e gravação presencial quando necessário.
- Sites feitos recentemente: WB Soluções Elétricas, CAIG, Quiro, Maré e Sabor. Criativo: Ópticas Miyagui. Cases antigos já no site: Showhome, Game Safari, DDTizz, Colonial Guararema, Amazônia Vital.
- Caso âncora WB (eletricista e engenheiro de energia): sem logo, logo + moodboard, site em poucos dias, Google Meu Negócio, campanha de rede de pesquisa para LP com rastreio gclid, levando ao WhatsApp.
- Stack: React + TypeScript + Vite + Tailwind + Framer Motion, deploy Netlify, Supabase. Prerender pós-build (Puppeteer) para GEO.

## Capabilities and Constraints
- Sem preços na home. Levar à consultoria; o quiz pode mostrar uma faixa estimada, nunca valor definitivo.
- Um único elemento 3D (hero), com lazy-load e fallback estático no mobile; respeitar prefers-reduced-motion.
- Manter prerender/GEO funcionando e a home antiga arquivada (noindex).
- WhatsApp: 5511992794634.
- Não afirmar "pontuação 100 no Search Console" (o Search Console não tem nota): validar com Lighthouse/PageSpeed antes de publicar qualquer número.
- Em aberto: permissão de uso de nomes e logos de clientes; resultados numéricos da WB; se "menos de 7 dias" é média ou promessa; URLs dos sites dos clientes.

## Brand Commitments
Preto + vermelho (identidade atual), logo "vm." em vermelho, WhatsApp como canal. Tom direto e profissional (referência: aqui.globo — cada seção importa, animação leve e eficaz). Referências do usuário: aqui.globo, scrolltide.co, 21st.dev. Não copiar a referência do Behance (Castrum), de onde só se aproveita a lógica de convencimento (problema, comparação, quem lidera).

## Evidence on Hand
- Foto do José Roberto (CEO / Gestor de Tráfego / cursando Engenharia da Computação em faculdade federal): arquivos-novahome/Retrato Masculino em Luz Vermelha.png.
- Vídeo de criativo feito com IA para Ópticas Miyagui (11 s, vertical): arquivos-novahome/video-criado-por-ia-para-o-cliente-opticas-miyagui.mp4.
- Números já usados no site: +10 milhões faturados para clientes, +1,5 milhão investido em anúncios, +5 mil anúncios criados (Google e Meta). Origem e período a confirmar.
- Ausentes (não inventar): depoimentos reais, métricas da WB, logos autorizados.

## Product Principles
1. Cada seção tem uma mensagem e uma animação, sem efeito decorativo.
2. Provar, não afirmar: processo real, vídeos reais, dados reais.
3. Ponta a ponta é o diferencial; tráfego é uma ferramenta, não a identidade.
4. Qualificar antes de vender: o diagnóstico filtra e leva à consultoria.
5. Performance é requisito: a home não pode ficar mais lenta que a atual.
