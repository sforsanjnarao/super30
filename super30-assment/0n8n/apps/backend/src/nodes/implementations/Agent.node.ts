import type { INode, INodeInput, INodeOutput } from '../INode.interface.ts';
import axios from 'axios'; // Example HTTP client

// All node files will export a class that implements INode
export class AgentNode implements INode {
  async execute(input: INodeInput): Promise<INodeOutput> {
    const { parameters, inputData, credentials } = input;

    // 1. Validate input and credentials
    if (!credentials || !credentials.apiKey) {
      throw new Error("OpenAI API key is missing from credentials.");
    }
    if (!parameters.prompt) {
      throw new Error("Prompt parameter is missing.");
    }

    // 2. Prepare the API request
    // This is where you would handle templating, like replacing {{ $json.someValue }}
    const prompt = this.resolveTemplate(parameters.prompt, inputData);
    const textToProcess = inputData.text || JSON.stringify(inputData);

    // 3. Perform the core action (call external API)
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'text-davinci-003',
      prompt: `${prompt}\n\n${textToProcess}`,
      max_tokens: 150,
    }, {
      headers: { 'Authorization': `Bearer ${credentials.apiKey}` }
    });

    // 4. Format the output
    // The 'result' will become the 'inputData' for the next node
    return {
      result: {
        summary: response.data.choices[0].text.trim(),
        originalData: inputData, // It's good practice to pass along original data
      }
    };
  }

  // Helper function for templating (a real version would be more robust)
  private resolveTemplate(template: string, data: any): string {
    return template.replace(/\{\{ \$json\.(.*?) \}\}/g, (_, key) => {
      // Basic resolver, a real one would handle nested objects
      return data[key] || '';
    });
  }
}