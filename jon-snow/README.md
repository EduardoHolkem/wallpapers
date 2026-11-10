<div align="center">

# Jon Snow

<a href="https://eduardoholkem.github.io/wallpapers/live/jon-snow/"><img src="https://img.shields.io/badge/ver%20ao%20vivo-508cc8?style=for-the-badge&logo=googlechrome&logoColor=white"/></a>
<a href="https://github.com/EduardoHolkem/wallpapers/releases/tag/jon-snow-v1.1.0"><img src="https://img.shields.io/badge/baixar-2b4a6b?style=for-the-badge&logo=github&logoColor=white"/></a>
<img src="https://img.shields.io/badge/Wallpaper%20Engine-1c2733?style=for-the-badge&logo=steam&logoColor=white"/>
<img src="https://img.shields.io/badge/Lively%20Wallpaper-1c2733?style=for-the-badge&logo=windows&logoColor=white"/>

<img src="https://img.shields.io/badge/HTML5-121a22?style=flat-square&logo=html5&logoColor=cfe3ff"/>
<img src="https://img.shields.io/badge/CSS3-121a22?style=flat-square&logo=css3&logoColor=cfe3ff"/>
<img src="https://img.shields.io/badge/JavaScript-121a22?style=flat-square&logo=javascript&logoColor=cfe3ff"/>
<img src="https://img.shields.io/badge/Canvas%20API-121a22?style=flat-square&logo=html5&logoColor=cfe3ff"/>

<br/><br/>

<a href="https://eduardoholkem.github.io/wallpapers/live/jon-snow/"><img src="assets/preview.jpg" width="92%" alt="Prévia do wallpaper Jon Snow"/></a>
<br/>
<sub>clique na imagem para ver o wallpaper rodando no navegador</sub>

</div>

## Sobre

**Jon Snow** mostra o Jon no meio de uma nevasca, com a neve caindo na frente dele em velocidades e tamanhos diferentes e um brilho azulado pulsando nas costas. A imagem respira bem de leve.

O código foi revisado para ficar no mesmo padrão do [Lilacs](../lilacs), mais leve e com opções nas configurações.

## Recursos

| | |
|---|---|
| **Nevasca** | flocos de vários tamanhos e velocidades, levados por um vento leve |
| **Brilho azulado** | uma luz fria atrás da personagem que cresce e diminui devagar |
| **Respiração** | a imagem aumenta e diminui bem de leve, num ciclo de seis segundos |
| **Relógio** | hora e data em português, no canto superior esquerdo, que acompanham o tamanho da tela |
| **Leve** | flocos desenhados a partir de uma imagem pronta, todas as animações no mesmo ritmo do FPS escolhido e um modo leve que liga sozinho em PC sem placa de vídeo |
| **Qualquer tela** | flocos e relógio acompanham o tamanho da tela, então fica igual num monitor grande, num notebook ou num Steam Deck |

## Instalação

Baixe o arquivo da sua plataforma na [release do Jon Snow](https://github.com/EduardoHolkem/wallpapers/releases/tag/jon-snow-v1.1.0).

<details open>
<summary><b>Wallpaper Engine</b></summary>
<br/>

1. Baixe `JonSnow-WallpaperEngine.zip` e extraia a pasta `JonSnow` dentro de `wallpaper_engine/projects/myprojects`.
2. Abra o Wallpaper Engine. O Jon Snow aparece na sua lista de wallpapers. Se não aparecer, use **Abrir wallpaper** e escolha `JonSnow/index.html`.

</details>

<details open>
<summary><b>Lively Wallpaper</b></summary>
<br/>

1. Baixe `JonSnow-Lively.zip` (não precisa extrair).
2. Arraste o zip para dentro da janela do Lively.
3. Clique com o botão direito no wallpaper e use **Personalizar** para mudar as opções.

</details>

<details open>
<summary><b>Sem Wallpaper Engine nem Lively</b></summary>
<br/>

Baixe a imagem estática, sem o relógio, e use como papel de parede comum no PC ou no celular.

- [Imagem para PC (2560x1440)](https://eduardoholkem.github.io/wallpapers/imagens/JonSnow-PC.jpg)
- [Imagem para celular (1080x2340)](https://eduardoholkem.github.io/wallpapers/imagens/JonSnow-Celular.jpg)

</details>

## Opções

| Opção | Padrão | O que faz |
|---|---|---|
| Quantidade de neve | 100% | de 0 a 200% |
| Brilho atrás da personagem | ligado | a luz azulada pulsando |
| Mostrar relógio | ligado | hora e data no canto superior esquerdo |
| Desempenho | automático | no automático, o modo leve liga sozinho quando o PC não tem placa de vídeo ou não sustenta o FPS. Ele deixa o brilho e a personagem parados e desenha os flocos sem esticar a imagem, o que pesa bem menos |
| FPS | 30 | limite de quadros por segundo |

## Estrutura

```
jon-snow
├── src/                código do wallpaper (index.html e imagem)
├── wallpaper-engine/   project.json com as opções do Wallpaper Engine
├── lively/             LivelyInfo.json e LivelyProperties.json
├── imagem/             imagem estática para PC e celular
└── assets/             prévia
```

## Créditos

Feito por **[Eduardo Holkem](https://github.com/EduardoHolkem)** com HTML, CSS e JavaScript puro.

Este é um projeto de fã, sem ligação oficial com Game of Thrones ou com a HBO. Personagem e imagem pertencem aos seus donos. O código está sob a licença MIT.
