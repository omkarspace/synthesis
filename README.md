# Synthesis

A powerful, AI-driven platform for automating research workflows, generating comprehensive papers, and analyzing complex documents. Built with Next.js 16, React 19, and Google's Gemini AI.

![AI Research App Dashboard](public/dashboard-preview.png)

## 🚀 Key Features

### 🤖 Advanced AI Agent Pipeline
- **Reader Agent**: Parses and understands complex research papers (PDF/DOCX).
- **Summarizer Agent**: Extracts key insights and generates concise summaries.
- **Graph Agent**: Builds a knowledge graph connecting concepts across documents.
- **Hypothesis Agent**: Generates novel research hypotheses based on analyzed data.
- **Experiment Agent**: Designs experiments to validate hypotheses.
- **Writer Agent**: Synthesizes findings into full-length research papers.

### ⚡ Performance & Core Capabilities
- **Streaming AI Responses**: Real-time token-by-token generation for immediate feedback.
- **Vector Search (RAG)**: Semantic search across all your documents using Gemini embeddings.
- **Chat with Research**: Ask questions about your documents and get cited answers.
- **Rich Text Editor**: Full-featured inline editor (TipTap) for refining generated papers.

### 📄 Comprehensive Export Options
- **PDF**: Professional formatting for sharing.
- **LaTeX**: Ready-to-compile `.tex` files for academic publishing.
- **DOCX**: Microsoft Word compatible documents.
- **Markdown**: Clean text format for blogs and documentation.

### 📊 Analytics & Visualization
- **Concept Networks**: Interactive graphs showing relationships between ideas.
- **Quality Metrics**: Real-time scoring of hypothesis novelty and feasibility.
- **Citation Analysis**: Automatic extraction and tracking of references.
- **Word Count Trends**: Visual tracking of paper evolution.

### 🛠️ Project Management
- **Project Templates**: Pre-configured structures for Literature Reviews, Theses, Case Studies, and more.
- **Version Control**: Track changes, view diffs, and rollback to previous versions.
- **Smart Organization**: Tagging, archiving, and filtering capabilities.

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons
- **Backend**: Next.js API Routes, Prisma ORM, SQLite
- **AI & ML**: Google Generative AI (Gemini), ChromaDB (Vector Store)
- **Data Visualization**: Recharts, D3.js support
- **Document Processing**: `pdf-parse`, `mammoth`, `jspdf`, `docx`

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/omkarspace/synthesis.git
    cd ai-research-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up environment variables**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="file:./dev.db"
    GEMINI_API_KEY="your_gemini_api_key_here"
    ```

4.  **Initialize the database**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run the development server**
    ```bash
    npm run dev
    ```

6.  **Open the app**
    Visit `http://localhost:3000` in your browser.

## 📖 Usage Guide

### Creating a New Project
1.  Click **"New Project"** on the dashboard.
2.  Select a **Template** (e.g., Literature Review) or start from scratch.
3.  Upload your research documents (PDF/DOCX).
4.  Watch as the AI agents analyze, summarize, and generate your paper.

### Interacting with Research
- **Chat**: Use the "Ask Questions" tab to query your documents.
- **Edit**: Switch to "Edit Mode" in the paper viewer to refine the content.
- **Export**: Use the "Export Paper" dropdown to download in your preferred format.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
