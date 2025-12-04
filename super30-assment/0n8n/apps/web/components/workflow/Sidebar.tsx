'use client';

import React from 'react';
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NODE_DEFINITIONS } from '@/lib/nodes/definitions'; 

const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
};

export function Sidebar() {
    const [open, setOpen] = React.useState(false);

    return (
        <aside className="w-80 border-r bg-background p-4">
            <h2 className="text-lg font-semibold mb-4">Nodes</h2>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
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
                                {/* Map over the definitions to create the list */}
                                {NODE_DEFINITIONS.map((node) => (
                                    <CommandItem
                                        key={node.type}
                                        value={node.name}
                                        className="cursor-grab flex items-center"
                                        onDragStart={(event) => onDragStart(event, node.type)}
                                        draggable
                                    >
                                        <node.icon className="mr-2 h-4 w-4" />
                                        {node.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </aside>
    );
}