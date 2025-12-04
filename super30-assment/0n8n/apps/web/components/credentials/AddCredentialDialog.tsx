'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

// Define the shape of our credential types and their required fields
const credentialTypes = {
    telegramApi: {
        name: 'Telegram API',
        fields: [{ name: 'botToken', label: 'Bot Token', type: 'password' }],
    },
    openAiApi: {
        name: 'OpenAI API',
        fields: [{ name: 'apiKey', label: 'API Key', type: 'password' }],
    },
    // Add more types here as needed
};

export function AddCredentialDialog({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [data, setData] = useState({}); // To hold the values of the dynamic fields
  const [isCreating, setIsCreating] = useState(false);

  const handleFieldChange = (fieldName: string, value: string) => {
    setData(prev => ({...prev, [fieldName]: value}));
  };

  const resetState = () => {
    setStep(1);
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
        .then(resolve)
        .catch(reject);
    });

    toast.promise(promise, {
        loading: 'Saving credential...',
        success: () => {
            handleClose();
            onSuccess();
            return 'Credential saved successfully!';
        },
        error: (err: any) =>
            err?.response?.data?.message || err.message || "Failed to save credential.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Credential</DialogTitle>
          <DialogDescription>
            Securely save your API keys and tokens to use in your workflows.
          </DialogDescription>
        </DialogHeader>
        
        {/* Step 1: Select Type */}
        <div className="space-y-2">
            <Label htmlFor="cred-type">Credential Type</Label>
            <Select onValueChange={(value) => setSelectedType(value)}>
                <SelectTrigger id="cred-type">
                    <SelectValue placeholder="Select a service..." />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(credentialTypes).map(([key, value]) => (
                        <SelectItem key={key} value={key}>{value.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        {/* Step 2: Fill in Details (conditionally rendered) */}
        {selectedType && (
            <div className="space-y-4 pt-4">
                 <div className="space-y-2">
                    <Label htmlFor="cred-name">Display Name</Label>
                    <Input id="cred-name" value={name} onChange={e => setName(e.target.value)} placeholder="My OpenAI Key" />
                </div>
                {credentialTypes[selectedType].fields.map(field => (
                    <div key={field.name} className="space-y-2">
                        <Label htmlFor={field.name}>{field.label}</Label>
                        <Input 
                            id={field.name} 
                            type={field.type}
                            onChange={e => handleFieldChange(field.name, e.target.value)}
                        />
                    </div>
                ))}
            </div>
        )}
        
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

