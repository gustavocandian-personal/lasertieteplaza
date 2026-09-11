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
     A loja fica no Tietê Plaza pelo menos até dez/2026 (decisão de 11/08).
     Se mudar de endereço, troque aqui e nada mais quebra.                   */
  unidade: {
    nome: 'Tietê Plaza Shopping',
    endereco: 'Av. Raimundo Pereira de Magalhães, 1465 — Jardim Íris, São Paulo/SP',
    referencia: 'Piso térreo · estacionamento no shopping',
    horario: 'Seg a sáb, 10h às 22h · Dom, 14h às 20h',

    /* Botão "Ver no mapa": abre o perfil da CLÍNICA no Google Maps (ou no
       app de mapas do celular). O CID é o identificador fixo do perfil.
       Até 10/09/2026 apontava para o perfil do shopping, e quem clicava
       nunca via a nota da clínica.                                        */
    mapsUrl: 'https://maps.google.com/?cid=9865193678951033634',

    /* Mapa embutido na seção "Onde estamos". Carrega em lazy: não pesa no
       tempo de abertura da página.
       A busca pelo nome EXATO do perfil ("Laser & Company - Tietê Plaza")
       é o que faz o mapa abrir com o cartão da clínica (nota e rota). Testado
       em 10/09/2026: por CID, por ftid e pelo nome + endereço o mapa abre sem
       cartão nenhum; o endereço antigo mostrava o cartão do shopping, com a
       nota DELE (4,5 e 56 mil avaliações). Se o perfil mudar de nome no
       Google, trocar aqui também.                                         */
    mapsEmbed: 'https://www.google.com/maps?q=Laser+%26+Company+-+Tiet%C3%AA+Plaza&hl=pt-BR&z=17&output=embed'
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

  /* PostHog — analytics + heatmap + gravação de sessão no mesmo painel.
     Substituiu o Microsoft Clarity em 10/09/2026. Vazio = desligado.
     Onde pegar: posthog.com → Settings → Project → Project API key
     (começa com "phc_"; é chave pública, pode ficar no código do site).

     As páginas registram "lp" e "area" como propriedade de TODO evento —
     filtram heatmap, gravação e funil por página e por grupo de anúncio
     (?a=) — e o clique no WhatsApp vira o evento `whatsapp_click`.
     Projeto: "Default project" (id 602595), org Solaraphi.                 */
  posthog: {
    key:  'phc_BnJkP3esE3fu8RHsn3RHyHYp6bgmiithxz58SJzf9tiH',
    host: 'https://us.i.posthog.com'   /* us.i… ou eu.i… conforme a região */
  },

  /* Google Analytics 4 — ID de métricas ("G-XXXXXXXXXX").
     Onde pegar: analytics.google.com → Administrador → Fluxos de dados.
     ⚠️ PREENCHER — com o ID aqui, o gtag é injetado nas duas páginas e o
     clique no WhatsApp vira o evento `whatsapp_click` no GA4 (com lp, area
     e posicao). Marcando ele como evento-chave e vinculando GA4 ↔ Google
     Ads, ele pode ser importado como conversão da campanha.                */
  ga4Id: 'G-MHTJG3P4CH',

  /* Conversão direta do Google Ads, sem GTM. Com os dois preenchidos, o
     clique no WhatsApp dispara `conversion` para id/label. Ativada em
     10/09/2026.
     ⚠️ O mesmo clique também chega ao Ads pelo GA4 (`whatsapp_click`
     importado, ação "LP Tiete Plaza (web) whatsapp_click"). Só UMA das duas
     ações pode ser principal no Google Ads, senão cada conversa vira 2
     conversões.                                                            */
  googleAds: {
    id: 'AW-18382689419',
    conversionLabel: 'kWmrCLXUxfMcEIupxr1E'
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
