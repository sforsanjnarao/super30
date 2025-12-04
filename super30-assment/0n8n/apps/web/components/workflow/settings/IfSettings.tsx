'use client';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IfSettingsProps {
  nodeData: {
    parameters?: {
      value1?: string;
      operator?: string;
      value2?: string;
    };
  };
  onUpdate: (data: object) => void;
  // This node does not require credentials, so we don't need the credentials prop
}

const operators = [
    { value: 'equal', label: 'Equals' },
    { value: 'notEqual', label: 'Does Not Equal' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
    { value: 'contains', label: 'Contains' },
];

export function IfSettings({ nodeData, onUpdate }: IfSettingsProps) {
  
  const handleParamChange = (paramName: string, value: string) => {
    onUpdate({
      parameters: {
        ...nodeData.parameters,
        [paramName]: value,
      }
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        This node will check a condition and direct the workflow down the 'TRUE' or 'FALSE' path.
      </p>
      <div className="space-y-2">
        <Label htmlFor="value1">Value 1</Label>
        <Input 
          id="value1"
          value={nodeData.parameters?.value1 || ''}
          onChange={(e) => handleParamChange('value1', e.target.value)}
          placeholder="e.g., {{ $json.someValue }}"
        />
        <p className="text-xs text-muted-foreground">
          Can be a static value or a variable from a previous node.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label>Operator</Label>
        <Select
          value={nodeData.parameters?.operator}
          onValueChange={(value) => handleParamChange('operator', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an operator" />
          </SelectTrigger>
          <SelectContent>
            {operators.map(op => (
                <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="value2">Value 2</Label>
        <Input 
          id="value2"
          value={nodeData.parameters?.value2 || ''}
          onChange={(e) => handleParamChange('value2', e.target.value)}
          placeholder="e.g., A static value"
        />
      </div>
    </div>
  );
}