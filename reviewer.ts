import OpenAI from 'openai';
import core from '@actions/core';

const test = async () => {
  const openai = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
  });

  const prompt = `Your job is to only check styling guidelines. You must ignore any code that is not related to styling guidelines mentioned below.
  The guidelines:
  - Environment variables should be in all caps.
  - A styled component that uses styled-components should not declare the colors manually instead use the theme.
  - Enum names and keys MUST be in PascalCase, while enum values can be in any format.
  - When importing a react component, it MUST be without any extension.
  - React hooks MUST be with .ts extension instead of .tsx.
  - react-components styling file MUST be with .ts extension instead of .tsx.
  - booleans variables MUST start with 'is' or 'has' or 'should'.
  - Prefer Boolean(variable) over !!variable.
  - Prefer Number(variable) over +variable.
  - Prefer importing types with import type instead of import.
  - Prefer named imports over default imports unless it's from a library.
  - Always use FC type for functional components when props are used.
  - The initial or outermost component returned in a .tsx file must be named 'Root' unless it is imported from a styles file, is a fragment, or is an HTML element.
  - You MUST use transient variable names for styled components props.
  - Prefer using empty <></> over Fragment unless you need to pass key.
  - The name of the react component MUST be in PascalCase and match the file name.
  You have the following code: ${process.env.DIFF}. 
  Your response MUST ALWAYS ONLY output as structured json as follows:

  Array<{violations: string, file: string, line: number}>

  The violations MUST include the full reason for the violation.
  The line MUST be the line number of the issue.
  If there are no issues, violation should be empty.
  THE RESPONSE MUST ONLY BE A JSON ARRAY. OTHERWISE YOU WILL BE BANNED.
  `;

  console.log({ diff: process.env.DIFF });

  const result = await openai.chat.completions.create({
    model: 'openai/o3-mini',
    messages: [{ role: 'user', content: prompt }],
  });

  console.log({ result: result.choices[0].message.content });
  const jsonOutput = result.choices[0].message.content?.replaceAll('```json', '').replaceAll('```', '');

  console.log({ jsonOutput: jsonOutput });
  const parsedJson = JSON.parse(jsonOutput || '[]');

  const filteredJson = parsedJson.filter(
    (item: { file: string; violations: string; line: number }) =>
      item.violations !== '' && item.violations !== null && item.violations !== undefined && item?.violations?.length
  );

  const chunks = filteredJson.map(
    (item: { file: string; violations: string; line: number }) =>
      `File: ${item.file}\nLine: ${item.line}\nViolations: ${item.violations}\n\n`
  );

  const review = `${chunks.join('\n\n')}`;

  core.setOutput('review', chunks ? review : '');
};

await test();
