# Craftisle Draw

<p align="center">
  <a href="https://draw.craftisle.com">
    <img alt="Craftisle Draw" src="public/logo.svg" width="120" />
  </a>
</p>

<h1 align="center">Craftisle Draw — Free Online Whiteboard</h1>

<p align="center">
  <a href="https://draw.craftisle.com">Live Site</a> ·
  <a href="https://github.com/yysam123456-source/craftisle-draw/issues">Issues</a> ·
  <a href="#features">Features</a>
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue" />
  <img alt="Excalidraw" src="https://img.shields.io/badge/Excalidraw-5.0.0-ff5722?logo=excalidraw" />
  <img alt="React" src="https://img.shields.io/badge/React-18-61dafb?logo=react" />
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel" />
</p>

---

## 🌐 Live Site

👉 **[draw.craftisle.com](https://draw.craftisle.com)** — free online whiteboard, no signup required.

Part of the [Craftisle](https://www.craftisle.com) tool ecosystem.

---

## ✨ Features

Craftisle Draw is a free, browser-based whiteboard powered by [Excalidraw](https://excalidraw.com), with zero server uploads and no registration.

### Drawing Tools
| Feature | Description |
|---------|-------------|
| **Freehand Drawing** | Smooth pen tool with pressure sensitivity |
| **Shape Library** | Rectangle, ellipse, diamond, arrow, line, draw |
| **Text Tool** | Add text with custom fonts and sizes |
| **Sticky Notes** | Quick idea capture with colors |
| **Image Upload** | Drag & drop images onto canvas |
| **Hand Tool** | Pan around the canvas seamlessly |

### Collaboration (Local)
| Feature | Description |
|---------|-------------|
| **Local Save** | Auto-save to browser localStorage |
| **Export PNG/SVG** | Export drawings in multiple formats |
| **JSON Import/Export** | Share drawings as `.excalidraw` files |
| **Multi-page** | Organize drawings across multiple scenes |

### UI Features
| Feature | Description |
|---------|-------------|
| **Dark/Light Mode** | Theme toggle |
| **Zoom & Pan** | Infinite canvas with smooth zoom |
| **Undo/Redo** | Full history support |
| **Keyboard Shortcuts** | Power-user friendly |
| **Mobile Friendly** | Touch-optimized for tablets |

---

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| **Excalidraw** | Core whiteboard engine |
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Fast build tool |
| **Tailwind CSS** | Utility-first styling |
| **localStorage API** | Local persistence |
| **Vercel** | Deployment |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- pnpm (recommended)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/yysam123456-source/craftisle-draw.git
cd craftisle-draw

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) to view locally.

### Build for Production

```bash
pnpm build
# Output: dist/
```

---

## 📦 Deployment

Deployed on **Vercel** — push to `main` branch triggers auto-deploy.

👉 **[draw.craftisle.com](https://draw.craftisle.com)**

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yysam123456-source/craftisle-draw)

---

## 📁 Project Structure

```
craftisle-draw/
├── public/              # Static assets
├── src/
│   ├── components/     # React components
│   ├── excalidraw/    # Excalidraw integration
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🔗 Related Projects

| Project | URL | Description |
|---------|-----|-------------|
| **Craftisle Main** | [www.craftisle.com](https://www.craftisle.com) | Tool hub & homepage |
| **PDF Tools** | [pdf.craftisle.com](https://pdf.craftisle.com) | PDF merge, split, compress |
| **Resume Builder** | [resume.craftisle.com](https://resume.craftisle.com) | Free resume generator |
| **File Viewer** | [viewer.craftisle.com](https://viewer.craftisle.com) | Online file viewer |
| **Image Prompt** | [imgprompt.craftisle.com](https://imgprompt.craftisle.com) | AI image prompt generator |
| **Games** | [game.craftisle.com](https://game.craftisle.com) | Casual HTML5 games |

---

## 🤝 Contributing

Contributions welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

[MIT License](LICENSE) — free to use, modify, and distribute.

---

## 🔗 Links

- 🌐 **Live Site**: [draw.craftisle.com](https://draw.craftisle.com)
- 💻 **GitHub**: [yysam123456-source/craftisle-draw](https://github.com/yysam123456-source/craftisle-draw)
- 🏠 **Main Site**: [www.craftisle.com](https://www.craftisle.com)
- 🐦 **Twitter**: [@CraftisleApp](https://twitter.com/CraftisleApp)

---

<p align="center">
  Built with ❤️ by the Craftisle team ·
  <a href="https://www.craftisle.com">Visit Craftisle</a>
</p>
