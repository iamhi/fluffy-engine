import OpenAI from 'openai';

import { GENERAL_MODEL } from './constants.js';

const client = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
});

const SERVICE_ROLE = 'service';
const SERVICE_PROMPT = `
You are a service which provides answers.
`;

const SERVICE_MESSAGE = {
  role: SERVICE_ROLE,
  content: SERVICE_PROMPT,
};

// Agent which summarizes the input and provides an answer
export const executeAgent = async (messages = []) => {
  const context = [SERVICE_MESSAGE, ...messages];

  const response = await client.chat.completions.create({
    model: GENERAL_MODEL,
    messages: context,
    max_tokens: 10000,
  });

  return response.choices[0].message.content;
};
