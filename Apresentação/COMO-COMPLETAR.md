# Portfólio VirtualMark: o que falta para fechar o deck

Link do deck (privado): https://claude.ai/artifact/W2b25wRpQUQ9QMuibCqCo8

Coloque os arquivos abaixo em `Apresentação/prints/` com **exatamente estes nomes**. Eu troco os espaços pontilhados do deck pelas imagens.

## 1. Prints e fotos

Já aplicados no deck: site e takes da **Quiropraxia** (slide 5, vindos de quiropraxiafernandes.com.br), site da **Showhome** (slide 7), e-commerces (slide 12), Miyagui (slides 10 e 11).

Ainda faltam, opcionais, em `Apresentação/prints/`:

| Arquivo | Onde entra |
|---|---|
| `wb-site.png` e `wb-logo.png` | Slide 8 (WB) |
| `caig-site.png` | Slide 9 (CAIG) |

Antes de enviar o deck, confirme com a Quiropraxia o uso das imagens de pacientes (slide 5).

## Slide de planos (slide 14)

Montado a partir da sua imagem de referência (`prints/planos-trafego-referencia.png`). Os valores são o investimento em campanhas gerenciado por mês, não o valor da gestão. Confirme se o slide vai em todas as versões ou só quando o cliente pedir.

## 2. Dados para confirmar antes de enviar

- Slide 3: origem e período de **R$ 10 milhões / R$ 1,5 milhão / 5 mil anúncios**.
- Slide 6: confirmar o que **já está em produção** no rastreio da Quiropraxia (clique registrado, vínculo no banco, envio ao Google por API).
- Slide 13: o Google Ads é de 2024. Confirmar **qual cliente e qual período** do Meta Ads (aparece como `[Confirmar...]` no rodapé do slide). Se tiver números recentes do Games Safari, troco.
- Slide 16: "menos de 7 dias" é média ou promessa?
- Slide 17: telefone usado é (11) 99279-4634 (o deck antigo tinha +55 11 91334-5769).
- Slide 9 (CAIG) é opcional. Mostra cuidado com o público, mas ainda não tem resultado comercial.

## 3. Prompts para o ChatGPT (opcionais, para dar acabamento)

Estilo comum a todos: fundo preto `#0A0A0A`, luz vermelha lateral `#F2223C` (rim light), fotografia cinematográfica, sem texto e sem logos inventados.

### 3.1 Mockup de dispositivos (um por case)
Anexe o print do site e use:

> Use the attached website screenshot exactly as it is, as the screen of a modern laptop and, overlapping on the right, a smartphone showing the same site. Do not change, redraw or invent any text, logo or UI on the screens. Dark matte black studio background (#0A0A0A) with a soft red rim light (#F2223C) coming from the left edge of the devices. Cinematic product photography, subtle reflection on the floor, shallow depth of field, no extra objects, no text added. 16:10 landscape, high resolution.

Para o slide da Showhome (formato quase quadrado), troque o final por: `1:1 square composition, laptop centered with the phone overlapping at the bottom right.`

### 3.2 Fundo de seção (textura)
> Abstract dark cinematic background: matte black faceted glass shards and thin glowing red edge lines (#F2223C) catching light from the top right corner, deep black shadows on the left side for text, no text, no logos, subtle film grain. 16:9, 2560×1440.

### 3.3 Foto de bastidor (se não tiver uma boa)
> Documentary-style photo of a small marketing team recording a short video for a client in a clinic: one person holding a smartphone on a gimbal, another reviewing the footage, natural light, shallow depth of field, realistic, no text. 3:2 landscape.

Preferência: foto real da gravação (slide 5). Use este prompt só se não houver nenhuma boa.

### 3.4 Retrato do José (se quiser uma versão larga para outro slide)
Já existe a versão em `public/home/jose.webp`. Se quiser estendida para 16:9:

> Use this photo of the same person. Extend the black background and the red rim lighting to the right and left to fill a 16:9 frame, keeping the face, skin, hair, expression and lighting exactly as in the original. Do not retouch, beautify or change identity. Cinematic low-key portrait, black background, red rim light on the left.

## 4. Slide dos e-commerces (slide 12)

Usa prints das home pages atuais de Games Safari, Gamebox, GSL Games, Dash Controles, Fruit de la Passion e Megatumii (em `assets/site-*.jpg`). Confirme o escopo de cada um (tráfego, site, criativos) e se todos podem aparecer. Para trocar um print, substitua o arquivo e me avise.

## 5. Arquivos já gerados e usados no deck (em `Apresentação/assets/`)

- `bg-capa`, `bg-base`, `bg-fim`: fundos no estilo do PDF (estilhaços escuros com arestas vermelhas). A capa mostra as telas reais de Miyagui, Games Safari e Gamebox.
- `x-render.png`: o X do hero da LP (não é mais usado na capa).
- `miyagui-site-desktop.png`: print do site da Miyagui (já com o banner de cookies recusado).
- `miyagui-cena0..5.jpg`: cenas extraídas do vídeo da Miyagui.
