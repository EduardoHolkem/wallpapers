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
  { id: 'lilacs',   name: 'Lilacs',  version: '2.0.1', demo: 'demo.js' },
  { id: 'daemon',   name: 'Daemon',  version: '1.0.1' },
  { id: 'jon-snow', name: 'JonSnow', version: '1.0.1' }
];

const root = __dirname;
const mode = process.argv[2] || 'all';
const rm = p => fs.rmSync(p, { recursive: true, force: true });
const mkdir = p => fs.mkdirSync(p, { recursive: true });
const copyDir = (from, to) => { mkdir(to); fs.cpSync(from, to, { recursive: true }); };
const tar = process.platform === 'win32' ? 'C:\\Windows\\System32\\tar.exe' : 'zip';

function zip(out, cwd, items) {
  if (fs.existsSync(out)) fs.unlinkSync(out);
  const args = process.platform === 'win32' ? ['-a', '-c', '-f', out, ...items] : ['-r', '-q', out, ...items];
  execFileSync(tar, args, { cwd });
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
