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
     Cada chave vira H1 + mensagem do WhatsApp própria, mantendo a oferta de
     virilha no herói (é o que vende).                                       */
  var VARIACOES = {
    /* LP A */
    virilha:   { h1: 'Depilação a laser de <em>virilha</em>',    detalhe: 'quero agendar a depilação de virilha' },
    axilas:    { h1: 'Depilação a laser de <em>axilas</em>',     detalhe: 'quero agendar a depilação de axilas' },
    pernas:    { h1: 'Depilação a laser de <em>pernas</em>',     detalhe: 'quero agendar a depilação de pernas' },
    corpo:     { h1: 'Depilação a laser <em>corpo inteiro</em>', detalhe: 'quero agendar o pacote de corpo inteiro' },
    masculina: { h1: 'Depilação a laser <em>masculina</em>',     detalhe: 'quero agendar a depilação masculina' },
    /* LP B */
    'clareamento-virilha': { h1: 'Clareamento de <em>virilha</em>', detalhe: 'quero agendar o clareamento de virilha' },
    'clareamento-axila':   { h1: 'Clareamento de <em>axilas</em>',  detalhe: 'quero agendar o clareamento de axilas' }
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

  /* De onde o cliente veio — abre TODA mensagem, inclusive as dos botões
     de seção. É o que diz ao atendimento se o lead é de depilação ou de
     clareamento antes mesmo de ele responder.                              */
  var origemPagina  = document.body.getAttribute('data-origem') || 'página do site';
  var detalhePadrao = document.body.getAttribute('data-detalhe') || 'quero agendar uma avaliação';

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
    /* Cada botão só define o {detalhe}; a origem entra sempre, pelo template.
       Assim não existe botão que chegue no WhatsApp sem dizer de onde veio. */
    var detalhe = el.getAttribute('data-zap-detalhe')
      || (variacao ? variacao.detalhe : detalhePadrao);

    var texto = (C.mensagemWhatsApp || 'Olá! Vim da {origem} e {detalhe}.')
      .replace('{origem}', origemPagina)
      .replace('{detalhe}', detalhe);

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
