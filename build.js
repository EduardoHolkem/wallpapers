// Monta as versões de cada wallpaper e o site do hub.
//   node build.js         gera tudo (dist/ e site/)
//   node build.js dist    só as versões e os zips, em dist/
//   node build.js site    só o site do hub, em site/
//
// Para incluir um wallpaper novo, crie a pasta dele no mesmo formato das outras
// (src/, wallpaper-engine/, lively/, assets/preview.jpg, README.md), coloque
// uma linha na lista abaixo e um bloco em hub/data.js.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const WALLPAPERS = [
  { id: 'lilacs',   name: 'Lilacs',  version: '2.1.1', demo: 'demo.js' },
  { id: 'daemon',   name: 'Daemon',  version: '1.1.1' },
  { id: 'jon-snow', name: 'JonSnow', version: '1.1.1' }
];

const root = __dirname;
const mode = process.argv[2] || 'all';
const rm = p => fs.rmSync(p, { recursive: true, force: true });
const mkdir = p => fs.mkdirSync(p, { recursive: true });
const copyDir = (from, to) => { mkdir(to); fs.cpSync(from, to, { recursive: true }); };
// No Windows os zips são feitos pelo próprio .NET (System.IO.Compression), o
// mesmo formato que o Lively e o Explorer leem. O tar.exe do Windows grava os
// arquivos com descritor de dados no fim, que alguns leitores estranham.
function zip(out, cwd, items) {
  if (fs.existsSync(out)) fs.unlinkSync(out);
  if (process.platform === 'win32') {
    const q = s => "'" + s.replace(/'/g, "''") + "'";
    const ps = 'Add-Type -AssemblyName System.IO.Compression,System.IO.Compression.FileSystem;' +
      '$z=[IO.Compression.ZipFile]::Open(' + q(out) + ',"Create");' +
      'foreach($i in @(' + items.map(i => q(path.join(cwd, i))).join(',') + ')){' +
      ' if(Test-Path -PathType Container $i){$b=Split-Path $i -Parent;' +
      '  Get-ChildItem $i -Recurse -File|%{[IO.Compression.ZipFileExtensions]::CreateEntryFromFile($z,$_.FullName,$_.FullName.Substring($b.Length+1).Replace([char]92,[char]47),"Optimal")|Out-Null}}' +
      ' else{[IO.Compression.ZipFileExtensions]::CreateEntryFromFile($z,$i,(Split-Path $i -Leaf),"Optimal")|Out-Null}};' +
      '$z.Dispose()';
    execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', ps]);
  } else execFileSync('zip', ['-r', '-q', out, ...items], { cwd });
  console.log('  zip', path.relative(root, out));
}

/* ---------- versões para Wallpaper Engine e Lively ---------- */
function buildDist() {
  const dist = path.join(root, 'dist');
  rm(dist); mkdir(path.join(dist, 'zips'));
  for (const w of WALLPAPERS) {
    const dir = path.join(root, w.id);
    const preview = path.join(dir, 'assets', 'preview.jpg');
    console.log(w.name, w.version);

    // Wallpaper Engine: uma pasta com o nome do wallpaper, pronta para myprojects
    const we = path.join(dist, w.id, w.name);
    copyDir(path.join(dir, 'src'), we);
    fs.copyFileSync(path.join(dir, 'wallpaper-engine', 'project.json'), path.join(we, 'project.json'));
    fs.copyFileSync(preview, path.join(we, 'preview.jpg'));
    zip(path.join(dist, 'zips', `${w.name}-WallpaperEngine.zip`), path.join(dist, w.id), [w.name]);

    // Lively: os arquivos ficam na raiz do zip
    const lv = path.join(dist, w.id, 'lively');
    copyDir(path.join(dir, 'src'), lv);
    for (const f of fs.readdirSync(path.join(dir, 'lively'))) fs.copyFileSync(path.join(dir, 'lively', f), path.join(lv, f));
    fs.copyFileSync(preview, path.join(lv, 'preview.jpg'));
    fs.copyFileSync(preview, path.join(lv, 'thumbnail.jpg'));
    zip(path.join(dist, 'zips', `${w.name}-Lively.zip`), lv, fs.readdirSync(lv));
  }
}

/* ---------- site do hub (GitHub Pages) ---------- */
function buildSite() {
  const site = path.join(root, 'site');
  rm(site);
  copyDir(path.join(root, 'hub'), site);
  // imagens estáticas de cada wallpaper, baixadas pelo botão Imagem do hub
  for (const w of WALLPAPERS) {
    const img = path.join(root, w.id, 'imagem');
    if (fs.existsSync(img)) copyDir(img, path.join(site, 'imagens'));
  }
  // cada wallpaper roda de verdade em site/live/<id>/, usado na prévia do hub
  for (const w of WALLPAPERS) {
    const live = path.join(site, 'live', w.id);
    copyDir(path.join(root, w.id, 'src'), live);
    if (w.demo) {
      fs.copyFileSync(path.join(root, w.id, w.demo), path.join(live, 'demo.js'));
      const index = path.join(live, 'index.html');
      fs.writeFileSync(index, fs.readFileSync(index, 'utf8').replace('</body>', '  <script src="demo.js"></script>\n</body>'));
    }
  }
  // versão nos links do CSS e do JS: o navegador do celular não fica preso
  // numa cópia antiga guardada em cache depois de uma atualização
  const stamp = Date.now().toString(36);
  const index = path.join(site, 'index.html');
  fs.writeFileSync(index, fs.readFileSync(index, 'utf8').replace(/(href|src)="(style.css|data.js|app.js)"/g, (m, a, f) => a + '="' + f + '?v=' + stamp + '"'));
  protectSite(site);
  fs.writeFileSync(path.join(site, '.nojekyll'), '');
  console.log('site pronto em', path.relative(root, site) || '.');
}

/* ---------- compactação e segurança do site ----------
   Só a versão publicada é compactada: o código no repositório continua
   legível. Sem comentários e sem espaços, quem abre o F12 vê o site enxuto.
   Cada página também ganha uma política de segurança (CSP), que diz ao
   navegador de onde cada coisa pode vir. Um script injetado por fora, por
   exemplo, é bloqueado, porque só rodam os scripts do próprio site e os
   blocos internos cuja impressão digital (sha256) está na política. */
function protectSite(site) {
  let esbuild;
  try { esbuild = require('esbuild'); }
  catch (e) { console.warn('  esbuild não instalado (rode npm install): site publicado sem compactar'); return; }
  const crypto = require('crypto');
  const min = (code, loader) => esbuild.transformSync(code, { loader, minify: true, legalComments: 'none', target: 'es2020' }).code.trim();
  const sha = s => "'sha256-" + crypto.createHash('sha256').update(s, 'utf8').digest('base64') + "'";
  const walk = d => fs.readdirSync(d, { withFileTypes: true })
    .flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
  let before = 0, after = 0;
  for (const f of walk(site)) {
    const ext = path.extname(f);
    if (!['.js', '.css', '.html'].includes(ext)) continue;
    const src = fs.readFileSync(f, 'utf8');
    const out = ext === '.html' ? protectHtml(src, f) : min(src, ext.slice(1));
    before += Buffer.byteLength(src); after += Buffer.byteLength(out);
    fs.writeFileSync(f, out);
  }
  console.log('  compactado:', Math.round(before / 1024) + ' KB ->', Math.round(after / 1024) + ' KB');

  function protectHtml(html, file) {
    const blocks = [], scripts = [], styles = [];
    // estilos e scripts internos ficam guardados enquanto o HTML é enxugado,
    // para a impressão digital deles bater exatamente com o que vai na página
    const keep = s => '@@BLOCO' + (blocks.push(s) - 1) + '@@';
    html = html.replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<style>([\s\S]*?)<\/style>/g, (m, css) => { const c = min(css, 'css'); styles.push(sha(c)); return keep('<style>' + c + '</style>'); })
      .replace(/<script>([\s\S]*?)<\/script>/g, (m, js) => { const c = min(js, 'js'); scripts.push(sha(c)); return keep('<script>' + c + '</script>'); })
      .replace(/>\s*\n\s*</g, '><')          // recuo entre tags
      .replace(/\s*\n\s*/g, ' ')             // quebras de linha no meio do texto
      .replace(/@@BLOCO(\d+)@@/g, (m, i) => blocks[i])
      .trim();
    const live = file.includes(path.sep + 'live' + path.sep);
    const csp = [
      "default-src 'self'",
      ["script-src 'self'", ...scripts].join(' '),
      ["style-src 'self' https://fonts.googleapis.com", ...styles].join(' '),
      'font-src https://fonts.gstatic.com',
      "img-src 'self' data: blob:",
      "media-src 'self'",
      "connect-src 'self'" + (live ? ' https://lrclib.net' : ''),   // letras do Lilacs
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'none'"
    ].join('; ');
    const meta = '<meta http-equiv="Content-Security-Policy" content="' + csp + '">' +
                 '<meta name="referrer" content="strict-origin-when-cross-origin">';
    return html.replace(/<meta charset="UTF-8">/i, m => m + meta);
  }
}

if (mode === 'all' || mode === 'dist') buildDist();
if (mode === 'all' || mode === 'site') buildSite();
