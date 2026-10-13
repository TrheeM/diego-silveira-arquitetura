// Roda antes da pintura: evita o conteúdo da entrada piscar antes do GSAP assumir.
(function () {
    var c = document.documentElement.classList;
    c.add('js');
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) c.add('motion');
})();
