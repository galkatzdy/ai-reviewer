import OpenAI from 'openai';
import core from '@actions/core';

const test = async () => {
  const openai = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
  });
  // At the beginning of the response please mention the file you are reviewing. Also attach a code fix with the relevant context.
  const prompt = `Your job is to only check styling guidelines. You must ignore any code that is not related to styling guidelines mentioned below.
  The guidelines:
  - Every variable needs to be declared as camelCase.
  - Environment variables should be in all caps.
  - One word variables should be in lowercase.
  - Names of functions should be in camelCase.
  You the following code: ${process.env.DIFF}. Your response MUST ALWAYS ONLY output as structured json as follows:
  [{
    "file": <filename>,
    "fixedCode": <fixed code>,
  }]

  If there are no issues, fixedCode should be empty.
  If you don't follow those instructions, you will be fired.
  `;

  const result = await openai.chat.completions.create({
    model: 'google/gemini-2.0-pro-exp-02-05:free',
    messages: [{ role: 'user', content: prompt }],
  });

  core.setOutput('review', result.choices[0].message.content);
};

await test();
