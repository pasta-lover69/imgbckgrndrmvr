# AI Background Remover

AI-powered background remover that runs entirely in your browser. Upload any image and get a precise, transparent PNG — no server, no signup, no limits. Built with the U2-Net deep learning model via WebAssembly.

## Project Structure

```
imgbckgrndrmvr/
├── public/
│   └── index.html        # Full app (UI + client-side AI processing)
├── vercel.json           # Vercel deployment config
└── .gitignore
```

## Features

- **AI-powered** — Uses U2-Net deep learning model for precise segmentation
- **Runs in-browser** — No server needed; AI model runs via WebAssembly + ONNX Runtime Web
- **Privacy-first** — Your images never leave your device
- Drag & drop or click to upload
- Download result as transparent PNG
- Supports PNG, JPG, JPEG, WEBP, BMP (up to 10MB)
- Responsive dark-themed UI
- ~40MB AI model downloaded on first use, cached by browser for subsequent uses

## Run Locally

Just serve the `public/` folder with any static server:

```bash
# Using Python
python -m http.server 3000 --directory public

# Using Node.js
npx serve public

# Using Vercel CLI
vercel dev
```

The app will be available at `http://localhost:3000`.

## Deploy to Vercel

1. **Push to GitHub**
2. **Import project on [vercel.com](https://vercel.com)**
3. Vercel auto-deploys as a static site — no build step, no serverless functions

Or via CLI:

```bash
npm i -g vercel
vercel --prod
```

## How It Works

1. User uploads an image via the web UI
2. The `@imgly/background-removal` library loads the U2-Net ONNX model (cached after first download)
3. The AI model runs entirely in the browser using WebAssembly
4. The background is removed and a transparent PNG is displayed
5. User can download the result

## Tech Stack

- **AI Model:** U2-Net (via `@imgly/background-removal`)
- **Runtime:** ONNX Runtime Web (WebAssembly)
- **Frontend:** Vanilla HTML/CSS/JS (ES Modules)
- **Deployment:** Vercel (static site)
