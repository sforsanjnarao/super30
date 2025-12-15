'use client';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettingsFormProps } from "../SettingsPanel";
import { metaData } from "@lib/types02";

// interface TelegramSettingsProps {
//   nodeData: {
//     parameters?: {
//       chatId?: string;
//       text?: string;
//     };
//     credentialsId?: string;
//   };
//   onUpdate: (data: object) => void;
//   credentials: Credential[];
// }

interface TelegramParams {
  chatId?: string;
  text?: string;
}
interface TelegramProps extends SettingsFormProps {
  nodeData: metaData & {
    parameters: TelegramParams;
  };
}

export function TelegramSettings({ nodeData, onUpdate, credentials }:TelegramProps) {
  
  const handleParamChange = (paramName: string, value: string) => {
    onUpdate({
      parameters: {
        ...nodeData.parameters,
        [paramName]: value,
      }
    });
  };

  const handleCredentialChange = (credentialId: string) => {
     onUpdate({ credentialId: credentialId });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="chatId">Chat ID</Label>
        <Input 
          id="chatId"
          value={nodeData.parameters?.chatId || ''}
          onChange={(e) => handleParamChange('chatId', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="text">Message Text</Label>
        <Textarea
          id="text"
          value={nodeData.parameters?.text || ''}
          onChange={(e) => handleParamChange('text', e.target.value)}
          placeholder="You can use variables like {{ $json.someValue }}"
          rows={5}
        />
      </div>
      <div className="space-y-2">
        <Label>Credential</Label>
        <Select
          value={nodeData.credentialId}
          onValueChange={handleCredentialChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a Telegram credential" />
          </SelectTrigger>
          <SelectContent>
            {credentials.length > 0 ? (
                credentials.map(cred => (
                    <SelectItem key={cred.id} value={cred.id}>{cred.name}</SelectItem>
                ))
            ) : (
                <p className="p-4 text-sm text-muted-foreground">No Telegram credentials found.</p>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}