<div align="center">
  
  # 🌿 EcoWatch AI
  **"See environmental problems. Understand them. Act."**

  ![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Mistral AI](https://img.shields.io/badge/Mistral_AI-F68B29?style=for-the-badge)

</div>

## 📖 Overview

**EcoWatch AI** is a premium, agentic environmental intelligence platform built for hackathons and eco-activists. It empowers users to upload images of environmental anomalies (like plastic pollution, deforestation, or smog) and leverages a chained multi-agent AI pipeline to instantly analyze the problem, conduct real-time research, and generate a concrete action plan.

Rather than a simple "Upload image -> ChatGPT response" interaction, EcoWatch AI spins up a team of specialized AI agents:
1. **👁️ Vision Agent**: Identifies the anomaly, assesses severity, and extracts visual evidence.
2. **📚 Research Agent**: Finds context, underlying causes, and relevant scientific facts.
3. **💡 Solution Agent**: Compiles community, individual, and municipal action plans into a dynamic, beautiful dashboard.
4. **📊 Impact Agent**: Forecasts the potential positive impact if the intervention is executed.

## ✨ Features

- **Multi-Agent Workflow Simulation**: Visualizes the AI's thought process as it analyzes imagery in real-time.
- **Dynamic Analysis Dashboard**: A stunning, glassmorphic UI displaying severity scores, AI observations, research findings, and multi-tiered action plans.
- **Export to PDF**: Generate offline-ready reports with a single click using modern SVG-based canvas rendering.
- **Premium Aesthetics**: Smooth micro-animations, tailored dark mode (`#020617`), and dynamic particle backgrounds to make environmental data feel alive and actionable.

## 🏗️ Architecture

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Lucide React
- **Backend**: Next.js Serverless API Routes
- **AI Models**: Mistral AI SDK (`pixtral-12b-2409` for multimodal vision, `mistral-large-latest` for research and synthesis)
- **PDF Generation**: `html-to-image` and `jspdf`

## 🚀 Getting Started

Follow these instructions to run EcoWatch AI locally:

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ECOai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a file named `.env.local` in the root of the project. Get your API key from [Mistral AI](https://console.mistral.ai/) and add it:
```env
MISTRAL_API_KEY=your_actual_mistral_api_key_here
```

### 4. Run the Development Server
```bash
npm run dev
```

### 5. Test the Application
1. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).
2. Click **"Start Analysis"**.
3. Upload an image showing an environmental issue.
4. Watch the AI agents process the data and generate your intelligence report!

## 🛠️ Troubleshooting

- **Image Analysis fails or hangs**: Ensure your `MISTRAL_API_KEY` is correct in `.env.local`. 
- **PDF Download fails**: Ensure you are using the latest version of the repository, as legacy `html2canvas` parsing errors have been resolved by migrating to `html-to-image`.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---
*Built with ❤️ for the planet.*
