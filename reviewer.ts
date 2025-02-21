import OpenAI from 'openai';
import core from '@actions/core';

const test = async () => {
  const openai = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
  });
  const prompt = `Your job is to only check styling guidelines.
  At the beginning of the response please mention the file you are reviewing.
  The guidelines:
  - Every variable needs to be declared as lowerCamelCase.
  You the following code: ${process.env.DIFF}. If you don't find anything wrong, please return a string of 'NO_ISSUES'.`;

  const Result = await openai.chat.completions.create({
    model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
    messages: [{ role: 'user', content: prompt }],
  });

  core.setOutput('review', Result.choices[0].message.content);
};

await test();
