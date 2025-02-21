import OpenAI from 'openai';
import core from '@actions/core';

const test = async () => {
  const openai = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
  });

  const prompt = `Your job is to only check styling guidelines. You must ignore any code that is not related to styling guidelines mentioned below.
  The guidelines:
  - Every const variable needs to be declared as camelCase. One-word variables are allowed to be in lowercase.
  - Environment variables should be in all caps.
  - A styled component that uses styled-components should not declare the colors manually instead use the theme.
  - Enum name MUST be in PascalCase.
  - Enum keys MUST be in PascalCase.
  You have the following code: ${process.env.DIFF}. 
  Your response MUST ALWAYS ONLY output as structured json as follows:

  Array<{violations: string, file: string, line: number}>

  Each json object MUST represent a fix of function block of code, not a single line or entire file. 
  The violations MUST include the full reason for the violation.
  The line MUST be the line number of the issue.
  If there are no issues, reason should be empty.
  THE RESPONSE MUST ONLY BE A JSON ARRAY. OTHERWISE YOU WILL BE BANNED.
  `;

  const Result = await openai.chat.completions.create({
    model: 'google/gemini-2.0-pro-exp-02-05:free',
    messages: [{ role: 'user', content: prompt }],
  });

  console.log({ result: Result.choices[0].message.content });
  const jsonOutput = Result.choices[0].message.content?.replaceAll('```json', '').replaceAll('```', '');

  console.log({ jsonOutput: jsonOutput });
  const parsedJson = JSON.parse(jsonOutput || '[]');

  const filteredJson = parsedJson.filter(
    (item: { file: string; violations: string; line: number }) =>
      item.violations !== '' && item.violations !== null && item.violations !== undefined
  );

  const chunks = filteredJson.map(
    (item: { file: string; violations: string; line: number }) =>
      `File: ${item.file}\nLine: ${item.line}\nViolations: ${item.violations}\n\n`
  );

  const review = `${chunks.join('\n\n')}`;

  core.setOutput('review', chunks ? review : '');
};

await test();
