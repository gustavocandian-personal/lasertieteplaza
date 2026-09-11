/* ============================================================================
   Laser & Co — comportamento das landing pages
   ----------------------------------------------------------------------------
   1. Aplica o config.js no HTML (telefone, endereço, preços)
   2. Troca o H1 conforme ?a= (uma página serve vários grupos de anúncio)
   3. Monta os links de WhatsApp com mensagem contextual
   4. Dispara o MESMO evento de conversão nas duas LPs
   Não editar para colocar no ar — mexa só no config.js.
   ========================================================================== */
(function () {
  'use strict';

  var C = window.LASERCO || {};
  var params = new URLSearchParams(window.location.search);

  /* --- Variações de H1 por grupo de anúncio -------------------------------
     Uso: /depilacao-laser.html?a=axilas
     Cada chave troca o H1 e o produto que vai na mensagem do WhatsApp dos
     botões gerais (topo, herói, barra fixa, CTA final), mantendo a oferta
     de virilha no herói (é o que vende). A lista completa de mensagens está
     na base-conhecimento-servicos-laser-co.md §10.                          */
  var VARIACOES = {
    /* LP A */
    virilha:   { h1: 'Depilação a laser de <em>virilha</em>',    produto: 'Depilação a laser Virilha completa + perianal' },
    axilas:    { h1: 'Depilação a laser de <em>axilas</em>',     produto: 'Depilação a laser Axilas' },
    pernas:    { h1: 'Depilação a laser de <em>pernas</em>',     produto: 'Depilação a laser Pernas' },
    corpo:     { h1: 'Depilação a laser <em>corpo inteiro</em>', produto: 'Depilação a laser Corpo inteiro' },
    masculina: { h1: 'Depilação a laser <em>masculina</em>',     produto: 'Depilação a laser Masculina' },
    /* LP B */
    'clareamento-virilha': { h1: 'Clareamento de <em>virilha</em>', produto: 'Clareamento Virilha' },
    'clareamento-axila':   { h1: 'Clareamento de <em>axilas</em>',  produto: 'Clareamento Axilas' },
    /* LP C — no Google quem busca já sabe o nome técnico, então a variação
       usa o termo que a pessoa digitou. O H1 padrão (sem ?a=) vende o
       resultado, que é o que funciona no Meta.                            */
    ultrassom: { h1: 'Ultrassom microfocado <em>Full Face + Papada</em>', produto: 'Ultrassom Full Face + Papada' },
    papada:    { h1: 'Ultrassom para <em>papada</em>',                   produto: 'Ultrassom Papada' }
  };

  /* --- 1. Contexto da página: lp + area -----------------------------------
     Resolvido ANTES do tracking, de propósito. `lp` e `area` são
     registrados como propriedade de TODO evento do PostHog — inclusive do
     $pageview. Se fossem calculados depois do init, o pageview sairia sem
     eles: justo a métrica mais usada ficaria de fora da comparação
     LP A x LP B, que é o motivo de existirem duas páginas.                 */
  var area = (params.get('a') || '').toLowerCase();
  var variacao = Object.prototype.hasOwnProperty.call(VARIACOES, area) ? VARIACOES[area] : null;
  var h1 = document.querySelector('[data-h1]');

  if (variacao && h1) h1.innerHTML = variacao.h1;
  if (!variacao) area = h1 ? (h1.getAttribute('data-area-padrao') || 'geral') : 'geral';

  var lp = document.body.getAttribute('data-lp') || 'a';

  /* O que a mensagem do WhatsApp diz — é o que conta ao atendimento, antes
     de a pessoa responder, de onde ela veio e o que quer.
     {pagina}  = data-origem do <body> ("página do Ultrassom")
     {produto} = data-zap-produto do botão; nos botões gerais, o produto do
                 ?a= ou, sem ele, o data-produto do <body>                  */
  var paginaNome    = document.body.getAttribute('data-origem') || 'página do site';
  var produtoPadrao = document.body.getAttribute('data-produto') || '';

  /* Veio de anúncio do Google? Só aí a mensagem diz "Vim do Google": o
     Google Ads põe gclid/gbraid/wbraid/gad_source na URL (auto-tagging), e
     utm_source=google cobre quem marcar a URL na mão. Fica guardado na
     sessão: quem chegou pelo anúncio e passou para outra LP pelo rodapé
     continua sendo "do Google". Instagram, link direto e teste da equipe
     caem no texto da página.                                               */
  var doGoogle = ['gclid', 'gbraid', 'wbraid', 'gad_source'].some(function (k) { return params.has(k); })
    || /^google/i.test(params.get('utm_source') || '');
  try {
    if (doGoogle) sessionStorage.setItem('lc_fonte', 'google');
    else doGoogle = sessionStorage.getItem('lc_fonte') === 'google';
  } catch (e) { /* navegador sem sessionStorage: vale só a URL */ }

  /* --- 2. GTM ------------------------------------------------------------ */
  window.dataLayer = window.dataLayer || [];
  if (C.gtmId) {
    (function (w, d, s, i) {
      w[ 'dataLayer' ].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', C.gtmId);
  }

  /* --- 3. PostHog ---------------------------------------------------------
     Analytics + heatmap + gravação de sessão no mesmo painel. Substituiu o
     Microsoft Clarity em 10/09/2026. Snippet oficial: carrega o array.js em
     async e enfileira o que for chamado antes de ele chegar — por isso dá
     pra chamar register/capture na linha seguinte sem esperar nada.        */
  if (C.posthog && C.posthog.key) {
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",p.onerror=function(){p=null},(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

    window.posthog.init(C.posthog.key, {
      api_host: C.posthog.host || 'https://us.i.posthog.com',
      defaults: '2026-05-30',
      /* O $pageview sai na mão, logo abaixo, e não pelo init — é o que
         garante que ele nasça depois do register, com lp e area.          */
      capture_pageview: false,
      /* LP de mídia paga não tem login: ninguém nunca é identificado.
         Evento anônimo custa menos e basta pro web analytics.             */
      person_profiles: 'identified_only'
    });

    /* Acompanham todos os eventos daqui pra frente: filtram heatmap,
       gravação e funil por página (a|b) e por grupo de anúncio (?a=).     */
    window.posthog.register({ lp: lp, area: area || 'geral' });
    window.posthog.capture('$pageview');
  }

  /* --- 4. gtag — GA4 e/ou Google Ads -------------------------------------
     O script carrega uma vez; cada id presente ganha o seu `config` (é
     assim que GA4 e Ads convivem no mesmo gtag).                          */
  var gtagIds = [];
  if (C.ga4Id) gtagIds.push(C.ga4Id);
  if (C.googleAds && C.googleAds.id) gtagIds.push(C.googleAds.id);
  if (gtagIds.length) {
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + gtagIds[0];
    document.head.appendChild(g);
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    gtag('js', new Date());
    gtagIds.forEach(function (id) { gtag('config', id); });
  }

  /* --- 5. Preenche textos do config -------------------------------------- */
  function busca(caminho) {
    return caminho.split('.').reduce(function (o, k) {
      return (o && o[k] !== undefined) ? o[k] : null;
    }, C);
  }

  document.querySelectorAll('[data-config]').forEach(function (el) {
    var v = busca(el.getAttribute('data-config'));
    if (v === null || v === '') {
      /* sem valor: esconde o bloco em vez de mostrar campo vazio */
      var alvo = el.hasAttribute('data-esconde-se-vazio')
        ? el
        : el.closest('[data-esconde-se-vazio]');
      if (alvo) alvo.style.display = 'none';
      return;
    }
    if (el.tagName === 'A') el.href = v;
    /* iframe guarda a URL e só carrega perto da tela — ver §7 abaixo */
    else if (el.tagName === 'IFRAME') el.setAttribute('data-src', v);
    else el.textContent = v;
  });

  /* --- 6. Links de WhatsApp ---------------------------------------------- */
  var origem = '';
  if (C.incluirOrigemNaMensagem) {
    var g_ = params.get('gclid'), u_ = params.get('utm_source');
    if (g_ || u_) origem = '\n\n[ref: ' + (u_ || 'google') + (g_ ? '/' + g_.slice(0, 12) : '') + ']';
  }

  function montaLink(el) {
    /* Cada botão só define o produto; a frase vem do config. Do Google:
       "Olá! Vim do Google {produto}." Qualquer outra origem, ou botão sem
       produto: "Olá! Vim da {pagina}."                                     */
    var produto = el.getAttribute('data-zap-produto')
      || (variacao ? variacao.produto : produtoPadrao);
    var M = C.mensagemWhatsApp || {};

    var texto = (doGoogle && produto)
      ? (M.google || 'Olá! Vim do Google {produto}.').replace('{produto}', produto)
      : (M.pagina || 'Olá! Vim da {pagina}.').replace('{pagina}', paginaNome);

    var numero = (C.whatsapp || '').replace(/\D/g, '');
    el.href = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(texto + origem);
    el.target = '_blank';
    el.rel = 'noopener';
  }

  document.querySelectorAll('[data-zap]').forEach(function (el) {
    montaLink(el);

    el.addEventListener('click', function () {
      /* MESMO nome de evento nas duas LPs — a comparação depende disso.
         O que muda é o parâmetro.                                          */
      window.dataLayer.push({
        event: 'whatsapp_click',
        lp: lp,                                              // 'a' | 'b'
        area: area || 'geral',                               // virilha, axilas, ...
        posicao: el.getAttribute('data-zap-pos') || 'corpo', // hero, fixo, secao...
        pagina: window.location.pathname
      });

      /* No PostHog o clique é O evento de conversão: marca a gravação da
         sessão no instante exato e fecha o funil $pageview -> whatsapp_click.
         `lp` e `area` já vêm do register — aqui só o que muda por botão.   */
      if (window.posthog && typeof window.posthog.capture === 'function') {
        window.posthog.capture('whatsapp_click', {
          posicao: el.getAttribute('data-zap-pos') || 'corpo',
          pagina: window.location.pathname
        });
      }

      /* No GA4 o clique vira evento com os mesmos parâmetros do dataLayer.
         Marcado como evento-chave no GA4 + vínculo GA4↔Ads, ele é a
         conversão da campanha (resolve o §5 sem depender do GTM).          */
      if (typeof window.gtag === 'function' && C.ga4Id) {
        gtag('event', 'whatsapp_click', {
          lp: lp,
          area: area || 'geral',
          posicao: el.getAttribute('data-zap-pos') || 'corpo'
        });
      }

      if (typeof window.gtag === 'function' && C.googleAds && C.googleAds.id && C.googleAds.conversionLabel) {
        gtag('event', 'conversion', {
          send_to: C.googleAds.id + '/' + C.googleAds.conversionLabel
        });
      }
    });
  });

  /* --- 7. Mapa: carrega só quando a seção se aproxima da tela -------------
     O `loading="lazy"` nativo NÃO funciona quando o src é definido por JS
     depois da página montada — o iframe fica em branco. Como a URL vem do
     config, o adiamento é feito aqui na mão. Numa LP de mídia paga com ~90%
     de tráfego mobile, o mapa não pode pesar na abertura da página.        */
  document.querySelectorAll('iframe[data-src]').forEach(function (frame) {
    function carrega() {
      if (!frame.getAttribute('src')) frame.src = frame.getAttribute('data-src');
    }
    if (!('IntersectionObserver' in window)) return carrega();
    var obsMapa = new IntersectionObserver(function (entradas) {
      if (!entradas[0].isIntersecting) return;
      carrega();
      obsMapa.disconnect();
    }, { rootMargin: '500px 0px' }); /* começa a carregar antes de aparecer */
    obsMapa.observe(frame);
  });

  /* --- 8. Âncoras: marca a seção visível ---------------------------------- */
  var links = document.querySelectorAll('.ancoras a[href^="#"]');
  if (links.length && 'IntersectionObserver' in window) {
    var mapa = {};
    links.forEach(function (a) {
      var alvo = document.querySelector(a.getAttribute('href'));
      if (alvo) mapa[alvo.id] = a;
    });
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('ativo'); });
        if (mapa[e.target.id]) mapa[e.target.id].classList.add('ativo');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(mapa).forEach(function (id) {
      obs.observe(document.getElementById(id));
    });
  }
})();
