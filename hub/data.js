/* Lista de wallpapers do hub.
   Para colocar um wallpaper novo, copie um bloco e troque os dados.
   featured  true = aparece nos destaques do topo (até 4; o que faltar vira "bloqueado")
   poster    imagem parada usada no catálogo e antes da prévia carregar
   video     (opcional) vídeo curto que entra no lugar da imagem
   live      wallpaper rodando de verdade, mostrado dentro da prévia
   repo      página do wallpaper dentro do repositório wallpapers
   download  release com os arquivos para baixar
   accent    cor de destaque do wallpaper, usada nos detalhes da página */
(function () {
  const REPO = 'https://github.com/EduardoHolkem/wallpapers';
  const page = id => `${REPO}/tree/main/${id}`;
  const release = (id, v) => `${REPO}/releases/tag/${id}-v${v}`;

  window.WALLPAPERS = [
    {
      id: 'lilacs',
      name: 'Lilacs',
      featured: true,
      accent: '#9b5cff',
      platforms: ['Wallpaper Engine', 'Lively'],
      about: 'Inspirado em Lilacs, do Pastel Ghost. Fundo de quatro cores, fantasmas espelhados em neon, halo de luz RGB e glitch. Mostra a música que está tocando no Spotify ou no YouTube Music, com a letra sincronizada.',
      tech: ['HTML', 'CSS', 'JavaScript', 'Canvas API', 'LRCLIB'],
      poster: 'assets/posters/lilacs.jpg',
      live: 'live/lilacs/',
      repo: page('lilacs'),
      download: release('lilacs', '2.0.0')
    },
    {
      id: 'daemon',
      name: 'Daemon',
      featured: true,
      accent: '#ff4d5e',
      platforms: ['Wallpaper Engine', 'Lively'],
      about: 'Daemon Targaryen sobre um fundo vermelho escuro. Brasas douradas e vermelhas sobem na frente dele, encolhendo como se esfriassem, e um brilho pulsa atrás como uma fogueira.',
      tech: ['HTML', 'CSS', 'JavaScript', 'Canvas API'],
      poster: 'assets/posters/daemon.jpg',
      live: 'live/daemon/',
      repo: page('daemon'),
      download: release('daemon', '1.0.0')
    },
    {
      id: 'jon-snow',
      name: 'Jon Snow',
      featured: true,
      accent: '#cfe3ff',
      platforms: ['Wallpaper Engine', 'Lively'],
      about: 'Jon Snow no meio de uma nevasca. A neve cai na frente dele em velocidades diferentes, com um brilho azulado pulsando nas costas.',
      tech: ['HTML', 'CSS', 'JavaScript', 'Canvas API'],
      poster: 'assets/posters/jonsnow.jpg',
      live: 'live/jon-snow/',
      repo: page('jon-snow'),
      download: release('jon-snow', '1.0.0')
    }
  ];
})();
