/* Lista de wallpapers do hub.
   Para colocar um wallpaper novo, copie um bloco e troque os dados.
   featured  true = aparece nos destaques do topo (até 4; o que faltar vira "bloqueado")
   poster    imagem parada usada no catálogo e antes da prévia carregar
   video     (opcional) vídeo curto que entra no lugar da imagem
   live      wallpaper rodando de verdade, mostrado dentro da prévia
   repo      página do wallpaper dentro do repositório wallpapers
   downloads zips da release, um botão por plataforma (baixa direto)
   images    imagem estática para PC e celular, sem relógio nem player
   accent    cor de destaque do wallpaper, usada nos detalhes da página
   about     descrição em português (pt), inglês (en), espanhol (es), alemão (de) e russo (ru) */
(function () {
  const REPO = 'https://github.com/EduardoHolkem/wallpapers';
  const page = id => `${REPO}/tree/main/${id}`;
  // os zips de cada release seguem o padrão <Nome>-WallpaperEngine.zip e <Nome>-Lively.zip
  const zips = (id, v, file) => [
    { label: 'Wallpaper Engine', url: `${REPO}/releases/download/${id}-v${v}/${file}-WallpaperEngine.zip` },
    { label: 'Lively', url: `${REPO}/releases/download/${id}-v${v}/${file}-Lively.zip` }
  ];

  // imagem estática de cada wallpaper (fica em <pasta>/imagem e vai para site/imagens)
  const stills = file => ({ pc: `imagens/${file}-PC.jpg`, celular: `imagens/${file}-Celular.jpg` });

  window.WALLPAPERS = [
    {
      id: 'lilacs',
      name: 'Lilacs',
      featured: true,
      accent: '#9b5cff',
      platforms: ['Wallpaper Engine', 'Lively'],
      about: {
        pt: 'Inspirado em Lilacs, do Pastel Ghost. Fundo de quatro cores, fantasmas espelhados em neon, halo de luz RGB e glitch. Mostra a música que está tocando no Spotify ou no YouTube Music, com a letra sincronizada.',
        en: 'Inspired by Pastel Ghost’s song Lilacs. A four-color background, mirrored neon ghosts, an RGB light halo and glitches. It shows the song playing on Spotify or YouTube Music, with synced lyrics.',
        es: 'Inspirado en Lilacs, de Pastel Ghost. Fondo de cuatro colores, fantasmas de neón reflejados, halo de luz RGB y glitch. Muestra la canción que suena en Spotify o YouTube Music, con la letra sincronizada.',
        de: 'Inspiriert vom Song Lilacs von Pastel Ghost. Vierfarbiger Hintergrund, gespiegelte Neon-Geister, ein RGB-Lichtschein und Glitch-Effekte. Zeigt den Song, der gerade auf Spotify oder YouTube Music läuft, mit synchronisiertem Songtext.',
        ru: 'Вдохновлено песней Pastel Ghost «Lilacs». Четырёхцветный фон, зеркальные неоновые призраки, RGB-ореол и глитч. Показывает песню, которая играет в Spotify или YouTube Music, с синхронизированным текстом.'
      },
      tech: ['HTML', 'CSS', 'JavaScript', 'Canvas API', 'LRCLIB'],
      poster: 'assets/posters/lilacs.jpg',
      live: 'live/lilacs/',
      repo: page('lilacs'),
      downloads: zips('lilacs', '2.1.1', 'Lilacs'),
      images: stills('Lilacs')
    },
    {
      id: 'daemon',
      name: 'Daemon',
      featured: true,
      accent: '#ff4d5e',
      platforms: ['Wallpaper Engine', 'Lively'],
      about: {
        pt: 'Daemon Targaryen sobre um fundo vermelho escuro. Brasas douradas e vermelhas sobem na frente dele, encolhendo como se esfriassem, e um brilho pulsa atrás como uma fogueira.',
        en: 'Daemon Targaryen against a dark red background. Gold and red embers rise in front of him, shrinking as if they were cooling down, while a glow pulses behind him like a bonfire.',
        es: 'Daemon Targaryen sobre un fondo rojo oscuro. Brasas doradas y rojas suben frente a él, encogiéndose como si se enfriaran, mientras un resplandor late detrás como una hoguera.',
        de: 'Daemon Targaryen vor einem dunkelroten Hintergrund. Goldene und rote Funken steigen vor ihm auf und werden kleiner, als würden sie abkühlen, während hinter ihm ein Schein wie ein Lagerfeuer pulsiert.',
        ru: 'Деймон Таргариен на тёмно-красном фоне. Золотые и красные искры поднимаются перед ним и уменьшаются, словно остывая, а позади пульсирует свечение, как от костра.'
      },
      tech: ['HTML', 'CSS', 'JavaScript', 'Canvas API'],
      poster: 'assets/posters/daemon-hd.jpg',
      live: 'live/daemon/',
      repo: page('daemon'),
      downloads: zips('daemon', '1.1.1', 'Daemon'),
      images: stills('Daemon')
    },
    {
      id: 'jon-snow',
      name: 'Jon Snow',
      featured: true,
      accent: '#cfe3ff',
      platforms: ['Wallpaper Engine', 'Lively'],
      about: {
        pt: 'Jon Snow no meio de uma nevasca. A neve cai na frente dele em velocidades diferentes, com um brilho azulado pulsando nas costas.',
        en: 'Jon Snow in the middle of a blizzard. Snow falls in front of him at different speeds, with a bluish glow pulsing behind him.',
        es: 'Jon Snow en medio de una ventisca. La nieve cae frente a él a distintas velocidades, con un resplandor azulado que late a su espalda.',
        de: 'Jon Snow mitten in einem Schneesturm. Vor ihm fällt der Schnee mit unterschiedlicher Geschwindigkeit, während hinter ihm ein bläuliches Leuchten pulsiert.',
        ru: 'Джон Сноу посреди метели. Снег падает перед ним с разной скоростью, а за спиной пульсирует голубоватое свечение.'
      },
      tech: ['HTML', 'CSS', 'JavaScript', 'Canvas API'],
      poster: 'assets/posters/jonsnow-hd.jpg',
      live: 'live/jon-snow/',
      repo: page('jon-snow'),
      downloads: zips('jon-snow', '1.1.1', 'JonSnow'),
      images: stills('JonSnow')
    }
  ];

  // redes sociais, mostradas no topo e no rodapé (o ícone de cada uma está no app.js)
  window.SOCIAL = [
    { id: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/eduardoholkem/' },
    { id: 'tiktok',    name: 'TikTok',    url: 'https://www.tiktok.com/@eduardosholkem' },
    { id: 'pinterest', name: 'Pinterest', url: 'https://pin.it/1v8NKEYos' },
    { id: 'sharespot', name: 'ShareSpot', url: 'https://www.sharespotapp.com/eduardoholkem' }
  ];
})();
