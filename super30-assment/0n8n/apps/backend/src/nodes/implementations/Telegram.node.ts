import type { INode, INodeInput, INodeOutput } from '../INode.interface.ts';
import axios from 'axios';

export class TelegramNode implements INode {
  async execute(input: INodeInput): Promise<INodeOutput> {
    const { parameters, inputData, credentials } = input;

    if (!credentials || !credentials.botToken) {
      throw new Error("Telegram Bot Token is missing from credentials.");
    }
    try{
      const chatId = parameters.chatId;
      console.log('chatId:',chatId)
      const text = this.resolveTemplate(parameters.text, inputData); // Use templating
      console.log('credentials.botToken:',credentials.botToken)
      const url = `https://api.telegram.org/bot${credentials.botToken}/sendMessage`;
      const response = await axios.post(url, {
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      });


      return {
        result: {
          status: 'success',
          messageId: response.data.result.message_id,
          chatId: chatId,
        }
      };
    }catch (error:any) {
      console.log("ERROR RESPONSE:", error.response?.data);
      throw error;
      }
    
  }

  // A shared templating helper would be better in a real app
  private resolveTemplate(template: string, data: any): string {
    return template.replace(/\{\{ \$json\.(.*?) \}\}/g, (_, key) => data[key] || '');
  }
}

