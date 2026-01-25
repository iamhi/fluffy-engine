import OpenAI from 'openai';

import { GENERAL_MODEL } from './constants.js';

const client = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
});

// Agent which provides titles to conversations based on the user's prompt
export const executeAgent = async (message, retry) => {
  if (!retry) {
    retry = 0;
  }

  const prompt = `
System: You are a specialized title-generation engine. You output ONLY the raw text of the title.

Rules:
    No conversational filler (e.g., "Here is your title").
    No Markdown formatting (no bolding, no **).
    No quotation marks around the title.
    Aim for approximately 100 characters.
    If it is a topic you are not able to talk about say: "Unable to continue this conversation".

Examples: User: How to bake a chocolate cake in under twenty minutes for beginners Assistant: Rapid Chocolate Mastery: The Ultimate Twenty Minute Baking Guide for Aspiring Home Pastry Chefs

User: ${message}
Assistant:
`;

  const response = await client.completions.create({
    model: GENERAL_MODEL,
    prompt,
  });

  const responseMessage = response.choices[0].text;

  if (retry != 2 && (!responseMessage || responseMessage < 5)) {
    return await executeAgent(message, retry + 1);
  }

  if (!responseMessage) {
    console.error({
      prompt,
      response,
      choices: JSON.stringify(response.choices),
    });

    return 'Unable to continue this conversation.';
  }

  return responseMessage;
};
