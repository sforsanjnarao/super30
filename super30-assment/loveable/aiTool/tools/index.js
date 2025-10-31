import { z } from "zod";

export const createFile = {
    description: 'Create a file at a certain directory',
    parameters: z.object({
      location: z
        .string()
        .describe('Relative path to the file')
    }),
    execute: async ({ location }) => {
      return `File created`;
    },
};

export const updateFile = {
    description: 'Update a file at a certain directory',
    parameters: z.object({
      location: z.string().describe('Relative path to the file'),
      content: z.string().describe('Content of the file'),
    }),
    execute: async ({ location, content } ) => {
      return `File updated`;
    },
};

export const deleteFile = {
    description: 'Delete a file at a certain directory',
    parameters: z.object({
      location: z.string().describe('Relative path to the file'),
    }),
    execute: async ({ location }) => {
      return `File deleted`;
    },
};

export const readFile = {
    description: 'Read a file at a certain directory',
    parameters: z.object({
      location: z.string().describe('Relative path to the file'),
    }),
    execute: async ({ location }: { location: string }) => {
      return `File Contents`;
    },
};
