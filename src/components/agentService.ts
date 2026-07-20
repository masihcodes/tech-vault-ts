import { InferenceClient } from '@huggingface/inference';
import { AgentResponse } from './myTypes';



const hf = new InferenceClient(process.env.HUG_ACC_TOK);

const AGENT_MODELS = [
  'Qwen/Qwen2.5-Coder-7B-Instruct',
  'Qwen/Qwen2.5-Coder-32B-Instruct',
  'mistralai/Mistral-7B-Instruct-v0.3',
  'microsoft/Phi-3-mini-4k-instruct',
  'HuggingFaceH4/zephyr-7b-beta',
  'Qwen/Qwen2.5-7B-Instruct',

  //  'deepseek-ai/DeepSeek-Coder-V2-Instruct',
  //  'meta-llama/Llama-3.1-8B-Instruct',
  //  'mistralai/Codestral-22B-v0.1',
  //  'google/gemma-3-27b-it',
];


export async function generateLibraryDetails(name: string): Promise<AgentResponse | null> {
  const prompt = `You are an expert software engineer assistant. I will provide the name of a developer tool or library: "${name}".
You must respond ONLY with a valid JSON object. Do not include markdown formatting, backticks, or any introductory/concluding text.
The JSON format must be exactly:
{
  "description": "A concise 2-sentence summary of what problem this tool solves and its main features.",
  "installCommand": "The standard CLI command to install it (e.g., npm install zustand or cargo add serde).",
  "docsUrl": "The official documentation website URL (must start with https://)."
}`;


  for (const model of AGENT_MODELS) {
    try {
      const response = await hf.chatCompletion({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.1,
      });

      const rawText = response.choices[0].message.content || '';

      // const cleanedJson = rawText.replace(/```json|```/g, '').trim();
      const cleanedJson = rawText.match(/\{[\s\S]*\}/);
      if (!cleanedJson)
        throw new Error('AI did not return a valid JSON structure please try again');

      return JSON.parse(cleanedJson[0]) as AgentResponse;
    }
    catch (error) {
      console.error('AI Agent execution error:', error);
      return null;
    }
  }
  console.error('All AI Agent models failed.');
  return null;
}