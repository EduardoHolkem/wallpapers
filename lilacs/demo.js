/* Demo para o GitHub Pages.
   Simula uma música tocando para mostrar a caixa com capa e letra
   sincronizada. As linhas abaixo são textos de demonstração, não letra
   de música. No Wallpaper Engine e no Lively a música e a letra vêm do
   player de verdade. */
(function () {
  // o hub manda o idioma no endereço (?lang=pt, en, es, de ou ru)
  const LANG = (new URLSearchParams(location.search).get('lang') || 'pt').slice(0, 2);
  const TEXT = {
    pt: { title: 'Demo do wallpaper', lines: [
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
    ] },
    en: { title: 'Wallpaper demo', lines: [
      'this is a demo',
      'on your PC the music comes from Spotify',
      'or from YouTube Music in the browser',
      'the lyrics are found automatically',
      'and follow the timing of the song',
      '',
      'four colors spinning in the background',
      'mirrored neon ghosts',
      'an RGB light halo behind her',
      'glitch, film grain and scanlines',
      '',
      'move the mouse to see the parallax',
      'download it for Wallpaper Engine or Lively',
      'made with HTML, CSS and JavaScript'
    ] },
    es: { title: 'Demo del fondo', lines: [
      'esto es una demostración',
      'en tu PC la música viene de Spotify',
      'o de YouTube Music en el navegador',
      'la letra se busca sola',
      'y va al compás de la canción',
      '',
      'cuatro colores girando en el fondo',
      'fantasmas de neón reflejados',
      'un halo de luz RGB detrás de ella',
      'glitch, grano y scanlines',
      '',
      'mueve el cursor para ver el parallax',
      'descárgalo para Wallpaper Engine o Lively',
      'hecho con HTML, CSS y JavaScript'
    ] },
    de: { title: 'Wallpaper-Demo', lines: [
      'das ist eine Demo',
      'auf deinem PC kommt die Musik von Spotify',
      'oder von YouTube Music im Browser',
      'der Songtext wird automatisch gesucht',
      'und folgt dem Takt des Songs',
      '',
      'vier Farben kreisen im Hintergrund',
      'gespiegelte Neon-Geister',
      'ein RGB-Lichtschein hinter ihr',
      'Glitch, Körnung und Scanlines',
      '',
      'bewege die Maus für den Parallax-Effekt',
      'lade es für Wallpaper Engine oder Lively herunter',
      'erstellt mit HTML, CSS und JavaScript'
    ] },
    ru: { title: 'Демо обоев', lines: [
      'это демонстрация',
      'на вашем ПК музыка идёт из Spotify',
      'или из YouTube Music в браузере',
      'текст песни ищется автоматически',
      'и идёт в такт музыке',
      '',
      'четыре цвета кружатся на фоне',
      'зеркальные неоновые призраки',
      'RGB-ореол позади неё',
      'глитч, зерно и сканлайны',
      '',
      'двигайте мышью, чтобы увидеть параллакс',
      'скачайте для Wallpaper Engine или Lively',
      'сделано на HTML, CSS и JavaScript'
    ] }
  };
  const ARTIST = 'Eduardo Holkem';
  const TITLE = (TEXT[LANG] || TEXT.pt).title;
  const LINES = (TEXT[LANG] || TEXT.pt).lines;
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
