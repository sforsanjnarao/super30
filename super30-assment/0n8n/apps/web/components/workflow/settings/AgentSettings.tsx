'use client';

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Credential } from "@/app/(app)/credentials/page";

interface AgentSettingsProps {
  nodeData: {
    parameters?: {
      model?: string;
      prompt?: string;
    };
    credentialsId?: string;
  };
  onUpdate: (data: object) => void;
  credentials: Credential[];
}

export function AgentSettings({ nodeData, onUpdate, credentials }: AgentSettingsProps) {
  
  const handleParamChange = (paramName: string, value: string) => {
    onUpdate({
      parameters: {
        ...nodeData.parameters,
        [paramName]: value,
      }
    });
  };

  const handleCredentialChange = (credentialId: string) => {
     onUpdate({ credentialsId: credentialId });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Credential</Label>
        <Select
          value={nodeData.credentialsId}
          onValueChange={handleCredentialChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an OpenAI credential" />
          </SelectTrigger>
          <SelectContent>
            {credentials.length > 0 ? (
                credentials.map(cred => (
                    <SelectItem key={cred.id} value={cred.id}>{cred.name}</SelectItem>
                ))
            ) : (
                <p className="p-4 text-sm text-muted-foreground">No OpenAI credentials found.</p>
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>AI Model</Label>
        <Select
          value={nodeData.parameters?.model || 'gpt-3.5-turbo'}
          onValueChange={(value) => handleParamChange('model', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea
          id="prompt"
          value={nodeData.parameters?.prompt || ''}
          onChange={(e) => handleParamChange('prompt', e.target.value)}
          placeholder="e.g., Summarize the following text for me..."
          rows={8}
        />
        <p className="text-xs text-muted-foreground">
          Use variables like {"{{ $json.previousNodeOutput }}"} to include data from previous steps.
        </p>
      </div>
    </div>
  );
}