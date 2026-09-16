/* ============================================================================
   Laser & Co  ·  LP D (desafiante)  ·  os dois efeitos de navegacao do spec
   ----------------------------------------------------------------------------
   Carrega DEPOIS do lp.js e SO nesta pagina. Nao substitui nada: o lp.js
   continua dono do config, do ?a=, dos links de WhatsApp e da conversao.
   Se este arquivo nao carregar, a pagina funciona igual, sem os efeitos.

   1. Onda letra a letra no H1, na ENTRADA
      O spec do Flowmind faz no hover. Hover nao existe em ~90% do trafego
      desta conta, entao o efeito assinatura so aparece para quem esta no
      desktop. Na entrada, aparece para todo mundo.
      Roda depois do lp.js de proposito: e ele quem troca o H1 conforme o
      ?a= do grupo de anuncio, e a quebra precisa ser do texto final.

   2. Barra de ancoras: vidro sobre o heroi, solida quando gruda no topo

   Acessibilidade e o custo real do item 1: cada letra vira um <span>, e sem
   ajuda o leitor de tela soletra a manchete. Por isso o aria-label com o
   texto inteiro entra ANTES da quebra. E com `prefers-reduced-motion` o H1
   nem chega a ser quebrado: fica o texto normal, um no so.
   ========================================================================== */
(function () {
  'use strict';

  var reduz = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- 1. Onda letra a letra ---------------------------------------------- */
  var h1 = document.querySelector('.heroi-d [data-h1]');

  if (h1 && !reduz) {
    /* Primeiro o rotulo, depois a quebra: assim o leitor de tela anuncia a
       manchete inteira e ignora os spans. */
    h1.setAttribute('aria-label', h1.textContent.replace(/\s+/g, ' ').trim());

    var n = 0;

    /* Recursivo porque a manchete tem um <em> dentro (a palavra em serif
       italico). Quebrar so o texto de primeiro nivel deixaria a palavra de
       destaque fora do efeito, que e justamente a que mais importa.       */
    (function quebra(no) {
      Array.prototype.slice.call(no.childNodes).forEach(function (filho) {
        if (filho.nodeType === 3) {                 /* no de texto */
          var frag = document.createDocumentFragment();

          /* O HTML e indentado, entao o no de texto comeca com quebra de
             linha e espacos. Sem normalizar, esse recuo vira um espaco de
             verdade e a manchete nasce deslocada para a direita.        */
          var texto = filho.nodeValue.replace(/\s+/g, ' ');
          if (n === 0) texto = texto.replace(/^ /, '');

          /* Quebra por PALAVRA antes de quebrar por letra. Letra solta em
             inline-block vira ponto de quebra de linha, e a manchete parte
             no meio da palavra ("Adeus lâm / ina"). A palavra inteira num
             span `nowrap` devolve a quebra para onde ela deve estar: o
             espaco.                                                      */
          texto.split(/( )/).forEach(function (pedaco) {
            if (!pedaco) return;
            if (pedaco === ' ') { frag.appendChild(document.createTextNode(' ')); return; }

            var pal = document.createElement('span');
            pal.className = 'pal';

            pedaco.split('').forEach(function (ch) {
              var s = document.createElement('span');
              s.className = 'ltr';
              s.textContent = ch;
              /* Mesmo escalonamento do spec (i * 0.015), com um respiro
                 inicial para o cabecalho descer antes. Inline vence o
                 shorthand `animation` da folha, que zeraria o delay.     */
              s.style.animationDelay = (0.06 + n++ * 0.014).toFixed(3) + 's';
              pal.appendChild(s);
            });

            frag.appendChild(pal);
          });

          no.replaceChild(frag, filho);
        } else if (filho.nodeType === 1) {          /* o <em> */
          quebra(filho);
        }
      });
    })(h1);

    /* Liga a onda e, junto, desliga a entrada em bloco do H1 (lpd.css):
       com as duas, a manchete apareceria inteira e comeria o efeito. */
    h1.classList.add('ondulado');
  }

  /* --- 2. Barra de ancoras: vidro x solida --------------------------------
     A barra e `position: sticky; top: -1px` (lpd.css). Presa no topo, 1px
     dela fica fora da tela e a razao de interseccao cai abaixo de 1: e esse
     o sinal de que grudou. Dispensa sentinela no HTML e dispensa saber a
     altura da barra, que e o que costuma quebrar quando alguem mexe no
     padding dos itens depois.                                             */
  var nav = document.querySelector('.ancoras');

  if (nav && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entradas) {
      nav.classList.toggle('grudada', entradas[0].intersectionRatio < 1);
    }, { threshold: [1] }).observe(nav);
  }
})();
