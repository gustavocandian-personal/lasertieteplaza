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

  /* --- 1. GTM ------------------------------------------------------------ */
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
  /* Microsoft Clarity (heatmap + gravação). Snippet oficial, com o id vindo
     do config. As tags lp/area permitem filtrar heatmap por página e por
     grupo de anúncio (?a=).                                                */
  if (C.clarityId) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', C.clarityId);
  }
  if (C.googleAds && C.googleAds.id) {
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + C.googleAds.id;
    document.head.appendChild(g);
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', C.googleAds.id);
  }

  /* --- 2. Preenche textos do config -------------------------------------- */
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
    /* iframe guarda a URL e só carrega perto da tela — ver §5 abaixo */
    else if (el.tagName === 'IFRAME') el.setAttribute('data-src', v);
    else el.textContent = v;
  });

  /* --- 3. Variação de H1 -------------------------------------------------- */
  var area = (params.get('a') || '').toLowerCase();
  var variacao = Object.prototype.hasOwnProperty.call(VARIACOES, area) ? VARIACOES[area] : null;
  var h1 = document.querySelector('[data-h1]');

  if (variacao && h1) h1.innerHTML = variacao.h1;
  if (!variacao) area = h1 ? (h1.getAttribute('data-area-padrao') || 'geral') : 'geral';

  /* De onde o cliente veio — abre TODA mensagem, inclusive as dos botões
     de seção. É o que diz ao atendimento se o lead é de depilação ou de
     clareamento antes mesmo de ele responder.                              */
  var origemPagina  = document.body.getAttribute('data-origem') || 'página do site';
  var detalhePadrao = document.body.getAttribute('data-detalhe') || 'quero agendar uma avaliação';

  var lp = document.body.getAttribute('data-lp') || 'a';

  /* Tags no Clarity: filtram heatmap/gravações por página e grupo de anúncio */
  if (typeof window.clarity === 'function') {
    window.clarity('set', 'lp', lp);
    window.clarity('set', 'area', area || 'geral');
  }

  /* --- 4. Links de WhatsApp ---------------------------------------------- */
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

      /* No Clarity o clique vira evento — aparece nos filtros e marca a
         gravação da sessão no momento exato do clique                      */
      if (typeof window.clarity === 'function') {
        window.clarity('event', 'whatsapp_click');
      }

      if (typeof window.gtag === 'function' && C.googleAds && C.googleAds.id && C.googleAds.conversionLabel) {
        gtag('event', 'conversion', {
          send_to: C.googleAds.id + '/' + C.googleAds.conversionLabel
        });
      }
    });
  });

  /* --- 5. Mapa: carrega só quando a seção se aproxima da tela -------------
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

  /* --- 6. Âncoras: marca a seção visível ---------------------------------- */
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
