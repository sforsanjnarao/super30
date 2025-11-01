import type { INode, INodeInput, INodeOutput } from '../INode.interface.ts';
import axios from 'axios'; 

export class AgentNode implements INode {
  async execute(input: INodeInput): Promise<INodeOutput> {
    console.log(input)
    const { parameters, inputData, credentials } = input;
    if (!credentials || !credentials.apiKey) {
      throw new Error("OpenAI API key is missing from credentials.");
    }
    console.log('credentials:',credentials)
    console.log('credentials.data.apiKey:',credentials.apiKey)

    if (!parameters.prompt) {
      throw new Error("Prompt parameter is missing.");
    }

    //replacing {{ $json.someValue }}
    const prompt = this.resolveTemplate(parameters.prompt, inputData);
    const textToProcess = inputData.text || JSON.stringify(inputData);

    // const response = await axios.post('https://api.openai.com/v1/completions', {
    //   model: 'text-davinci-003',
    //   prompt: `${prompt}\n\n${textToProcess}`,
    //   max_tokens: 150,
    // }, {
    //   headers: { 'Authorization': `Bearer ${credentials.data.apiKey}` }
    // });

     const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${credentials.apiKey}`, {
      contents: [
        {
          role:"user",
          parts: [
            { text: `${prompt}\n\n${textToProcess}` }
          ]
        }
      ]
    });
    const outputText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    // The 'result' will become the 'inputData' for the next node
    return {
      result: {
        // summary: response.data.choices[0].text.trim(),
        summary: outputText,
        originalData: inputData,
      }
    };
  }

  private resolveTemplate(template: string, data: any): string {
    return template.replace(/\{\{ \$json\.(.*?) \}\}/g, (_, key) => {
      return data[key] || '';
    });
  }
}