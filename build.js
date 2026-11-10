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
  { id: 'lilacs',   name: 'Lilacs',  version: '2.1.0', demo: 'demo.js' },
  { id: 'daemon',   name: 'Daemon',  version: '1.1.0' },
  { id: 'jon-snow', name: 'JonSnow', version: '1.1.0' }
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
  fs.writeFileSync(path.join(site, '.nojekyll'), '');
  console.log('site pronto em', path.relative(root, site) || '.');
}

if (mode === 'all' || mode === 'dist') buildDist();
if (mode === 'all' || mode === 'site') buildSite();
