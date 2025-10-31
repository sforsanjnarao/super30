// Represents the decrypted credentials object
export interface ICredentials {
  [key: string]: any;
}

// Data passed into the node's execute method
export interface INodeInput {
  parameters: { [key: string]: any }; // Static config from the node's UI
  inputData: any; // Data from the previous node
  credentials?: ICredentials; // Decrypted credentials, if any
}

// The data structure returned by a node
export interface INodeOutput {
  // The primary data to be passed to the next node(s)
  result: any;

  // Optional: For routing nodes like "IF", this tells the worker which output to follow
  branch?: string; 
}

// The contract every node must follow
export interface INode {
  // Every node MUST have an execute method
  execute(input: INodeInput): Promise<INodeOutput>;
}