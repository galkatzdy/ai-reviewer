import OpenAI from 'openai';
import core from '@actions/core';

const test = async () => {
  const openai = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
  });

  const result = await openai.chat.completions.create({
    model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
    messages: [{ role: 'user', content: 'test' }],
  });

  core.setOutput('review', result.choices[0].message.content);
};

await test();
