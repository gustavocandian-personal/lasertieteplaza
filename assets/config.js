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
      de: 'R$ 1.799,90',
      prefixo: '',
      por: '12x R$ 99,90',
      selo: 'Perianal inclusa, sem pagar a mais'
    },
    combo: {
      titulo: 'Virilha + axilas',
      de: 'R$ 2.519,80',
      prefixo: '',
      por: '12x R$ 104,99',
      selo: 'Ganhe 1 sessão de clareamento'
    },
    /* ⚠️ PREENCHER — não existe preço de clareamento avulso no vault.
       Enquanto não tiver, a LP B usa o combo acima como âncora.            */
    clareamento: {
      titulo: 'Clareamento de virilha ou axila',
      de: '',
      prefixo: 'a partir de',
      por: '12x R$ 104,99',
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
