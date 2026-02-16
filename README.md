# Image Background Remover

A precise image background removal tool powered by **rembg** (U2-Net AI model), built with Python/Flask and deployable to Vercel.

## Project Structure

```
imgbckgrndrmvr/
├── api/
│   └── index.py          # Flask API (serverless function)
├── public/
│   └── index.html        # Frontend UI
├── requirements.txt      # Python dependencies
├── vercel.json           # Vercel deployment config
└── .gitignore
```

## Features

- Drag & drop or click to upload images
- Precise background removal using U2-Net deep learning model
- Alpha matting for clean, refined edges
- Download result as transparent PNG
- Supports PNG, JPG, JPEG, WEBP, BMP (up to 10MB)
- Responsive dark-themed UI

## Run Locally

1. **Create a virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate    # Linux/Mac
   venv\Scripts\activate       # Windows
   ```

2. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the dev server:**

   ```bash
   # Install Vercel CLI if you haven't
   npm i -g vercel

   # Run locally
   vercel dev
   ```

   The app will be available at `http://localhost:3000`.

## Deploy to Vercel

1. **Install the Vercel CLI:**

   ```bash
   npm i -g vercel
   ```

2. **Deploy:**

   ```bash
   vercel --prod
   ```

   Follow the prompts to link your project. Vercel will automatically detect the Python serverless function and static assets.

> **Note:** The `rembg` package with its ONNX model requires a larger function size. The `vercel.json` is configured with `maxLambdaSize: 250mb`. If you encounter size limits, consider using Vercel Pro or switching to the lighter `u2netp` model by updating the `remove()` call in `api/index.py` with `model_name="u2netp"`.

## How It Works

1. User uploads an image via the web UI
2. The image is sent to the `/api/remove-bg` endpoint
3. The Flask serverless function uses `rembg` with alpha matting to precisely remove the background
4. The processed transparent PNG is returned and displayed
5. User can download the result

## Tech Stack

- **Backend:** Python, Flask, rembg (U2-Net), Pillow
- **Frontend:** Vanilla HTML/CSS/JS
- **Deployment:** Vercel Serverless Functions
