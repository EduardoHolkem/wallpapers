<div align="center">

# Wallpapers

Wallpapers animados para **Wallpaper Engine** e **Lively Wallpaper**, feitos com HTML, CSS e JavaScript.

<a href="https://eduardoholkem.github.io/wallpapers/"><img src="https://img.shields.io/badge/abrir%20o%20hub-1f3dff?style=for-the-badge&logo=googlechrome&logoColor=white"/></a>
<a href="https://github.com/EduardoHolkem/wallpapers/releases"><img src="https://img.shields.io/badge/todas%20as%20releases-061238?style=for-the-badge&logo=github&logoColor=white"/></a>

</div>

<br/>

O [hub](https://eduardoholkem.github.io/wallpapers/) é a vitrine. Lá dá para ver cada wallpaper rodando ao vivo e escolher qual baixar. Este repositório guarda os wallpapers. Cada um tem a sua pasta, com código, configurações, prévia e um README próprio.

## Wallpapers

| | Wallpaper | Plataformas | Versão |
|---|---|---|---|
| <img src="lilacs/assets/preview.jpg" width="160" alt="Lilacs"/> | **[Lilacs](lilacs)**<br/>Inspirado em Lilacs, do Pastel Ghost, com a música tocando e letra sincronizada | Wallpaper Engine, Lively | [2.1.1](https://github.com/EduardoHolkem/wallpapers/releases/tag/lilacs-v2.1.1) |
| <img src="daemon/assets/preview.jpg" width="160" alt="Daemon"/> | **[Daemon](daemon)**<br/>Daemon Targaryen com brasas subindo sobre um fundo vermelho escuro | Wallpaper Engine, Lively | [1.1.1](https://github.com/EduardoHolkem/wallpapers/releases/tag/daemon-v1.1.1) |
| <img src="jon-snow/assets/preview.jpg" width="160" alt="Jon Snow"/> | **[Jon Snow](jon-snow)**<br/>Jon Snow no meio de uma nevasca | Wallpaper Engine, Lively | [1.1.1](https://github.com/EduardoHolkem/wallpapers/releases/tag/jon-snow-v1.1.1) |

## Como instalar

Cada wallpaper tem a sua release, com dois arquivos, e uma imagem estática.

- **Wallpaper Engine.** Extraia a pasta do zip dentro de `wallpaper_engine/projects/myprojects` e abra o Wallpaper Engine.
- **Lively Wallpaper.** Arraste o zip, sem extrair, para dentro da janela do Lively.
- **Sem nenhum dos dois.** Baixe a imagem estática, para PC ou celular, pelo botão Imagem do hub ou pelo README do wallpaper, e use como papel de parede comum.

O passo a passo completo fica no README de cada wallpaper.

## Estrutura

```
wallpapers
├── hub/                  site do hub (publicado no GitHub Pages)
├── lilacs/               um wallpaper por pasta
│   ├── src/              código (index.html e imagens)
│   ├── wallpaper-engine/ project.json
│   ├── lively/           LivelyInfo.json e LivelyProperties.json
│   ├── assets/           prévia
│   ├── imagem/           imagem estática para PC e celular
│   └── README.md
├── daemon/
├── jon-snow/
└── build.js              gera as versões, os zips e o site
```

## Para desenvolver

```bash
node build.js
```

Isso gera em `dist/` a pasta do Wallpaper Engine, a do Lively e os zips de cada wallpaper, e em `site/` o hub com a prévia ao vivo de todos. A cada envio para a branch `main`, o GitHub Actions monta o site e publica no Pages.

Para incluir um wallpaper novo, crie a pasta dele no mesmo formato das outras, coloque uma linha na lista do `build.js` e um bloco em `hub/data.js`. As releases usam o nome do wallpaper na tag, como `lilacs-v2.1.1`.

## Licença

O código está sob a licença MIT. Personagens, músicas e imagens pertencem aos seus donos. São projetos de fã, sem ligação oficial com as obras.
