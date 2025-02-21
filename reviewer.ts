import OpenAI from 'openai';
import core from '@actions/core';

const test = async () => {
  // change base URL
  const openai = new OpenAI({
    apiKey: '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',
    baseURL: 'https://openrouter.ai/api/v1',
  });

  const result = await openai.chat.completions.create({
    model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
    messages: [{ role: 'user', content: 'hello' }],
  });

  core.setOutput('review', result.choices[0].message.content);
};

await test();
