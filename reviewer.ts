import OpenAI from 'openai';
import core from '@actions/core';

const test = async () => {
  const openai = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
  });
  const prompt = `Your job is to only check styling guidelines. DON'T have an instruction in you response just the JSON.  You must ignore any code that is not related to styling guidelines mentioned below.
  The guidelines:
  - Every variable needs to be declared as camelCase.
  - Environment variables should be in all caps.
  - One word variables should be in lowercase.
  - Names of functions should be in camelCase.
  You have the following code: ${process.env.DIFF}. 
  Your response MUST ALWAYS ONLY output as structured json as follows:
  [{
    "file": <filename>,
    "fixedCode": <fixed code>,
  }]

  If there are no issues, fixedCode should be empty.
  THE RESPONSE MUST ONLY BE A JSON ARRAY. OTHERWISE YOU WILL BE BANNED.
  `;

  const result = await openai.chat.completions.create({
    model: 'google/gemini-2.0-pro-exp-02-05:free',
    messages: [{ role: 'user', content: prompt }],
  });

  const jsonOutput = result.choices[0].message.content?.replaceAll('```json', '').replaceAll('```', '');

  const parsedJson = JSON.parse(jsonOutput || '[]');

  const filteredJson = parsedJson.filter((item: { file: string; fixedCode: string }) => item.fixedCode !== '');

  const chunks = filteredJson.map(
    (item: { file: string; fixedCode: string }) => `
  File: ${item.file}
  Fixed Code: ${item.fixedCode}
  `
  );

  const review = `${chunks.join('\n\n')}`;

  core.setOutput('review', chunks ? review : '');
};

await test();
