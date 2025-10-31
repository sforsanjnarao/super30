import type { INode, INodeInput, INodeOutput } from '../INode.interface.ts';
import axios from 'axios';

export class TelegramNode implements INode {
  async execute(input: INodeInput): Promise<INodeOutput> {
    const { parameters, inputData, credentials } = input;

    // 1. Validate
    if (!credentials || !credentials.botToken) {
      throw new Error("Telegram Bot Token is missing from credentials.");
    }
    const chatId = parameters.chatId;
    const text = this.resolveTemplate(parameters.text, inputData); // Use templating

    // 2. Perform the action
    const url = `https://api.telegram.org/bot${credentials.botToken}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown'
    });

    // 3. Format the output
    return {
      result: {
        status: 'success',
        messageId: response.data.result.message_id,
        chatId: chatId,
      }
    };
  }

  // A shared templating helper would be better in a real app
  private resolveTemplate(template: string, data: any): string {
    return template.replace(/\{\{ \$json\.(.*?) \}\}/g, (_, key) => data[key] || '');
  }
}

