export const EMBEDDING_MODEL =
  process.env.OLLAMA_EMBEDDING_MODEL || 'embeddinggemma:300m';

export const GENERAL_MODEL = process.env.OLLAMA_GENERAL_MODEL || 'gemma3:270m';

export const TOOLS_MODEL =
  process.env.OLLAMA_TOOLS_MODEL || 'functiongemma:270m';
