/* Demo para o GitHub Pages.
   Simula uma música tocando para mostrar a caixa com capa e letra
   sincronizada. As linhas abaixo são textos de demonstração, não letra
   de música. No Wallpaper Engine e no Lively a música e a letra vêm do
   player de verdade. */
(function () {
  const ARTIST = 'Eduardo Holkem';
  const TITLE = 'Demo do wallpaper';
  const LINES = [
    'isto é uma demonstração',
    'no seu PC a música vem do Spotify',
    'ou do YouTube Music no navegador',
    'a letra é buscada sozinha',
    'e acompanha o tempo da música',
    '',
    'quatro cores girando no fundo',
    'fantasmas espelhados em neon',
    'halo de luz RGB atrás dela',
    'glitch, granulação e scanlines',
    '',
    'mexa o mouse para ver o parallax',
    'baixe para Wallpaper Engine ou Lively',
    'feito com HTML, CSS e JavaScript'
  ];
  const STEP = 3;
  const LENGTH = LINES.length * STEP + 4;
  const lrc = LINES.map((s, i) => {
    const t = 1 + i * STEP, m = Math.floor(t / 60), sec = (t % 60).toFixed(2).padStart(5, '0');
    return `[${String(m).padStart(2, '0')}:${sec}] ${s}`;
  }).join('\n');

  function cover() {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 256, 256);
    g.addColorStop(0, '#ff3fb4'); g.addColorStop(0.35, '#9b5cff');
    g.addColorStop(0.7, '#2e6bff'); g.addColorStop(1, '#2ff3e0');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    x.fillStyle = 'rgba(10,4,24,.55)'; x.beginPath(); x.arc(128, 128, 70, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#fff'; x.font = '600 34px Segoe UI, Arial'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('demo', 128, 130);
    return c.toDataURL();
  }

  function start() {
    const M = window.__media; if (!M) return;
    M.seed(ARTIST, TITLE, { synced: lrc, plain: '', instrumental: false });
    M.onStatus({ enabled: true });
    M.onProps({ title: TITLE, artist: ARTIST, albumTitle: 'Lilacs Wallpaper' });
    M.onThumb({ thumbnail: cover(), primaryColor: '#9b5cff' });
    M.onPlayback({ state: 1 });
    let t0 = performance.now();
    M.onTimeline({ position: 0, duration: LENGTH });
    setInterval(() => {
      const pos = (performance.now() - t0) / 1000;
      if (pos >= LENGTH) { t0 = performance.now(); M.onTimeline({ position: 0, duration: LENGTH }); }
    }, 500);
  }
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
})();
