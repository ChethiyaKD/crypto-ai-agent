require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const { getSolPrice } = require('./tools/solPrice');

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

// Available tools for the AI agent
const tools = [
  {
    name: 'getSolPrice',
    description: 'Get the current price of Solana (SOL) from Solana Tracker',
    execute: getSolPrice
  }
];

// Function to process AI responses
async function processAIResponse(userMessage) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant specialized in cryptocurrency-related questions. You have access to real-time SOL price data through the getSolPrice tool."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      functions: [
        {
          name: "getSolPrice",
          description: "Get the current price of Solana (SOL)",
          parameters: {
            type: "object",
            properties: {},
            required: []
          }
        }
      ],
      function_call: "auto"
    });

    const responseMessage = completion.choices[0].message;

    // Check if the AI wants to call a function
    if (responseMessage.function_call) {
      const functionName = responseMessage.function_call.name;
      const tool = tools.find(t => t.name === functionName);
      
      if (tool) {
        const result = await tool.execute();
        
        // Get a final response from the AI with the tool's result
        const finalCompletion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful AI assistant specialized in cryptocurrency-related questions."
            },
            {
              role: "user",
              content: userMessage
            },
            responseMessage,
            {
              role: "function",
              name: functionName,
              content: JSON.stringify(result)
            }
          ]
        });
        
        return finalCompletion.choices[0].message.content;
      }
    }

    return responseMessage.content;
  } catch (error) {
    console.error('Error processing AI response:', error);
    throw error;
  }
}

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await processAIResponse(message);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Crypto AI Agent running on port ${port}`);
});