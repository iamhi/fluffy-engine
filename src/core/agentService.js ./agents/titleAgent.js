import OpenAI from 'openai';

import { GENERAL_MODEL } from './constants.js';

const client = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
});

export const executeAgent = async (prompt) => {
  const response = await client.completions.create({
    model: GENERAL_MODEL,
    prompt: `System: Make an interesting title from the user's prompt which follows. Make sure the title is around 100 characters. \nUser's prompt: ${prompt}`,
  });

  return response.choices[0].text;
};
