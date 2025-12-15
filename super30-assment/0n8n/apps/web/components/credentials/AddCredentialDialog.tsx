'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

// --- 1. Define Types for the Configuration Dictionary ---
// This defines what a "Form Field" looks like
type CredentialField = {
    name: string;
    label: string;
    type: string;
};

// This defines the structure of our settings object
type CredentialConfig = {
    name: string;
    fields: CredentialField[];
};

// --- 2. The Configuration Dictionary ---
// We use Record<string, CredentialConfig> so TypeScript knows 
// we can access this object using a string key.
const CREDENTIAL_CONFIGS: Record<string, CredentialConfig> = {
    telegramApi: {
        name: 'Telegram API',
        fields: [{ name: 'botToken', label: 'Bot Token', type: 'password' }],
    },
    openAiApi: {
        name: 'OpenAI API',
        fields: [{ name: 'apiKey', label: 'API Key', type: 'password' }],
    },
};

interface AddCredentialDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddCredentialDialog({ isOpen, onClose, onSuccess }: AddCredentialDialogProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [name, setName] = useState("");
  // We use Record<string, string> because form data is just key-value pairs
  const [data, setData] = useState<Record<string, string>>({}); 
  const [isCreating, setIsCreating] = useState(false);

  const handleFieldChange = (fieldName: string, value: string) => {
    setData(prev => ({...prev, [fieldName]: value}));
  };

  const resetState = () => {
    setSelectedType(null);
    setName("");
    setData({});
  }

  const handleClose = () => {
    resetState();
    onClose();
  }

  const handleCreate = async () => {
    if (!name || !selectedType || Object.keys(data).length === 0) {
        toast.error("Please fill in all required fields.");
        return;
    }

    setIsCreating(true); // Disable button while saving
    
    const promise = new Promise((resolve, reject) => {
        axios.post(
            "http://localhost:8080/api/v0/credentials/",
            {
                name,
                type: selectedType,
                data,
            },
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        )
        .then((res) => {
            resolve(res);
            // Wait for success to close
            handleClose();
            onSuccess();
            setIsCreating(false)
        })
        .catch(reject=>{setIsCreating(false),reject})
    });

    toast.promise(promise, {
        loading: 'Saving credential...',
        success: 'Credential saved successfully!',
        error: (err: any) =>
            err?.response?.data?.message || err.message || "Failed to save credential.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Credential</DialogTitle>
          <DialogDescription>
            Securely save your API keys and tokens to use in your workflows.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
            {/* Step 1: Select Type */}
            <div className="space-y-2">
                <Label htmlFor="cred-type">Credential Type</Label>
                <Select onValueChange={(value) => {
                    setSelectedType(value);
                    setData({}); // Reset data fields if type changes
                }}>
                    <SelectTrigger id="cred-type">
                        <SelectValue placeholder="Select a service..." />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(CREDENTIAL_CONFIGS).map(([key, config]) => (
                            <SelectItem key={key} value={key}>{config.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Step 2: Fill in Details (Dynamic Rendering) */}
            {selectedType && CREDENTIAL_CONFIGS[selectedType] && (
                <div className="space-y-4 border-t pt-4">
                     <div className="space-y-2">
                        <Label htmlFor="cred-name">Display Name</Label>
                        <Input 
                            id="cred-name" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="e.g. My Personal OpenAI Key" 
                        />
                    </div>
                    
                    {/* Iterate over the fields defined in CREDENTIAL_CONFIGS */}
                    {CREDENTIAL_CONFIGS[selectedType].fields.map(field => (
                        <div key={field.name} className="space-y-2">
                            <Label htmlFor={field.name}>{field.label}</Label>
                            <Input 
                                id={field.name} 
                                type={field.type}
                                value={data[field.name] || ''}
                                onChange={e => handleFieldChange(field.name, e.target.value)}
                                placeholder={field.label}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!selectedType || isCreating}>
            {isCreating ? 'Saving...' : 'Save Credential'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}