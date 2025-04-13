# Crypto AI Agent

An AI-powered agent that can answer cryptocurrency-related questions and provide real-time SOL price data.

## Features

- Answer cryptocurrency-related questions using OpenAI's GPT-3.5 Turbo
- Fetch real-time SOL price data from Solana Tracker
- RESTful API endpoint for chat interactions

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/crypto-ai-agent.git
cd crypto-ai-agent
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Edit the `.env` file and add your OpenAI API key:
```
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
```

## Running the Application

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Usage

Send a POST request to `/api/chat` with your question:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the current price of SOL?"}'
```

## Example Questions

- "What is the current price of SOL?"
- "Tell me about Solana's blockchain technology"
- "How does SOL staking work?"
- "What are the advantages of Solana over other blockchains?"

## License

MIT