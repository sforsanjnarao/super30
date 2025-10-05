"use client"
import React from 'react';
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils"; // Make sure you have this utility from shadcn
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

// --- Define your available nodes here ---
const availableNodes = [
    { value: 'triggerManual', label: 'Trigger manually' },
    { value: 'onAppEvent', label: 'On app event' },
    { value: 'onSchedule', label: 'On a schedule' },
    { value: 'webhookNode', label: 'On webhook call' },
    { value: 'onFormSubmission', label: 'On form submission' },
    { value: 'telegramNode', label: 'Telegram Bot' },
    // Add any other nodes you have
];

// --- The drag event handler ---
const onDragStart = (event: React.DragEvent, nodeType: string, nodeLabel: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/reactflow-label', nodeLabel); // Optional: pass label
    event.dataTransfer.effectAllowed = 'move';
};

export function Sidebar() {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="w-80 h-screen p-4 border-r border-gray-700 bg-gray-800">
            <h2 className="text-lg font-semibold mb-4">Nodes</h2>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-gray-700 hover:bg-gray-600"
                    >
                        Add a node...
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput placeholder="Search nodes..." />
                        <CommandList>
                            <CommandEmpty>No node found.</CommandEmpty>
                            <CommandGroup>
                                {availableNodes.map((node) => (
                                    <CommandItem
                                        key={node.value}
                                        value={node.label}
                                        className="cursor-grab"
                                        // --- Attach the drag handler here ---
                                        onDragStart={(event) => onDragStart(event, node.value, node.label)}
                                        draggable
                                    >
                                        {node.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}