/* ============================================================================
   CONFIG — Laser & Co · Landing pages Google Ads
   ----------------------------------------------------------------------------
   ESTE É O ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR PARA COLOCAR NO AR.
   Tudo que muda (telefone, endereço, preços) está aqui. As duas LPs leem daqui.
   ========================================================================== */

window.LASERCO = {

  /* --- 1. WhatsApp --------------------------------------------------------
     Formato: 55 + DDD + número, só dígitos. Ex.: 5511999998888
     WhatsApp da clínica: (11) 99961-5300                                    */
  whatsapp: '5511999615300',

  /* --- 2. Unidade ---------------------------------------------------------
     ⚠️ REVISAR — a loja do Tietê Plaza sai até 31/08/2026.
     Se mudar de endereço, troque aqui e nada mais quebra.                   */
  unidade: {
    nome: 'Tietê Plaza Shopping',
    endereco: 'Av. Raimundo Pereira de Magalhães, 1465 — Jardim Íris, São Paulo/SP',
    referencia: 'Piso térreo · estacionamento no shopping',
    horario: 'Seg a sáb, 10h às 22h · Dom, 14h às 20h',

    /* Botão "Ver no mapa" — abre o Google Maps / app de mapas do celular */
    mapsUrl: 'https://www.google.com/maps/place/Tietê+Plaza+Shopping/@-23.5065372,-46.7184784,17z',

    /* Mapa embutido na seção "Onde estamos".
       Carrega em lazy: não pesa no tempo de abertura da página.            */
    mapsEmbed: 'https://www.google.com/maps?q=Tietê+Plaza+Shopping,+Av.+Raimundo+Pereira+de+Magalhães,+1465,+São+Paulo&z=16&hl=pt-BR&output=embed'
  },

  /* --- 3. Ofertas ---------------------------------------------------------
     `de`      preço cheio riscado (deixe '' para não mostrar)
     `prefixo` texto pequeno antes da parcela, tipo "a partir de" ('' esconde)
     `por`     a parcela em destaque — CURTO, é o número gigante da página
     `selo`    a frase da pílula abaixo do preço                            */
  ofertas: {
    virilha: {
      titulo: 'Virilha completa + perianal',
      de: 'R$ 2.519,80',
      prefixo: '',
      por: '12x R$ 114,99',
      /* "Presente surpresa" em vez de "perianal inclusa": decisão da Kizzy
         (14/08) — gerar curiosidade em vez de entregar o brinde na LP.       */
      selo: 'Ganhe um presente surpresa'
    },
    combo: {
      titulo: 'Virilha + axilas',
      de: 'R$ 2.519,80',
      prefixo: '',
      por: '12x R$ 104,99',
      selo: 'Ganhe 1 sessão de clareamento'
    },
    /* Preço confirmado pelo Gustavo em 17/08/2026. Antes daqui a LP B usava
       o combo acima como âncora, por não haver valor de clareamento.       */
    clareamento: {
      titulo: 'Clareamento de virilha + axilas',
      de: '',
      prefixo: 'a partir de',
      por: '12x R$ 119,90',
      selo: '1ª sessão cortesia no combo com depilação'
    }
  },

  /* --- 4. Tracking --------------------------------------------------------
     GTM: cole o ID (GTM-XXXXXXX) e o container é injetado nas duas páginas.
     Deixe vazio se ainda não tem — a página funciona igual.

     ⚠️ As duas LPs disparam O MESMO evento (`whatsapp_click`), diferenciando
     por parâmetro. Não crie evento separado por página: isso destrói a
     comparação, que é justamente o motivo de existirem duas.                */
  gtmId: '',

  /* Microsoft Clarity (heatmap + gravação de sessão). Vazio = desligado.
     As páginas marcam tags "lp" e "area" — dá pra filtrar os heatmaps por
     página e por grupo de anúncio, e o clique no WhatsApp vira evento.      */
  clarityId: 'y1jxnl8vd5',

  /* Google Analytics 4 — ID de métricas ("G-XXXXXXXXXX").
     Onde pegar: analytics.google.com → Administrador → Fluxos de dados.
     ⚠️ PREENCHER — com o ID aqui, o gtag é injetado nas duas páginas e o
     clique no WhatsApp vira o evento `whatsapp_click` no GA4 (com lp, area
     e posicao). Marcando ele como evento-chave e vinculando GA4 ↔ Google
     Ads, ele pode ser importado como conversão da campanha.                */
  ga4Id: 'G-MHTJG3P4CH',

  /* Opcional: conversão direta do Google Ads, sem GTM.
     Preencha os dois para disparar gtag no clique do WhatsApp.              */
  googleAds: {
    id: '',              // ex.: 'AW-123456789'
    conversionLabel: ''  // ex.: 'AbC-D_efGh12345'
  },

  /* --- 5. Mensagem que já vai escrita no WhatsApp -------------------------
     Toda mensagem abre dizendo de QUAL PÁGINA o cliente veio. É assim que o
     atendimento sabe na hora se o lead é de depilação ou de clareamento —
     sem depender de relatório e sem ter que perguntar.

     {origem}  = a página (definida em cada HTML: "página de depilação" /
                 "página de clareamento")
     {detalhe} = o que o botão clicado oferece; já vem com o verbo, então
                 funciona tanto pra "quero agendar" quanto pra "quero saber
                 o valor"                                                    */
  mensagemWhatsApp: 'Olá! Vim da {origem} e {detalhe}.',

  /* Anexa também a origem de mídia (gclid/utm) no fim da mensagem.
     true = atendente vê que veio de anúncio. Deixa a mensagem menos limpa.  */
  incluirOrigemNaMensagem: false
};
