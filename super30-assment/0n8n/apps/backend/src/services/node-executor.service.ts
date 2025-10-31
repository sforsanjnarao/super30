/*The Brain: node-executor.service.ts (Service Layer)
Responsibility: Execute a single node.
Flow (execute):
Fetches the full Workflow and Execution records from the DB using the executionId.
Finds the specific node's configuration JSON within the workflow.nodes array using the nodeId.
Checks for a credentialsId in the node's config. If it exists, it fetches and decrypts the credential data from the Credentials table.
Based on the node.type (e.g., "Telegram", "Email"), it calls the specific execution code for that node. This is a great place for a switch statement or a factory pattern.
code
TypeScript
switch (node.type) {
  case 'Telegram':
    return await TelegramNode.execute(node.parameters, inputData, decryptedCredentials);
  case 'Email':
    return await EmailNode.execute(node.parameters, inputData, decryptedCredentials);
}
It returns the result (the outputData or an error) back to the worker.
 */




// Import all your node classes
import { AgentNode } from '../nodes/implementations/Agent.node.ts';
import prisma from '../lib/prisma.ts';
import type { ICredentials, INode, INodeInput } from '../nodes/INode.interface.ts';
import { TelegramNode } from '../nodes/implementations/Telegram.node.ts';
import { IfNode } from '../nodes/implementations/If.node.ts';
// import { getAndDecryptCredentials } from './credential.service'; // Assuming this function exists

// The registry of all available node types
const  nodeImplementations: { [key: string]: INode } = {
  'Agent': new AgentNode(),
  'Telegram': new TelegramNode(),
  'If': new IfNode(),
};

export const executeNode = async (job: { executionId: string, nodeId: string, inputData: any }) => {
  const { executionId, nodeId, inputData } = job;

  // 1. Fetch the workflow context for this execution
  const execution = await prisma.execution.findUnique({
    where: { id: executionId },
    include: { workflow: true }
  });

  if (!execution || !execution.workflow) {
    throw new Error(`Execution or workflow not found for executionId: ${executionId}`);
  }
  const { workflow } = execution;
  
  // 2. Find the specific node's configuration from the workflow blueprint
  const nodeConfig = (workflow.nodes as any).find((n: any) => n.id === nodeId);
  if (!nodeConfig) {
    throw new Error(`Node with ID ${nodeId} not found in workflow definition.`);
  }

  // 3. Find the correct node logic implementation from our registry
  const nodeImplementation = nodeImplementations[nodeConfig.type];
  if (!nodeImplementation) {
    throw new Error(`Execution logic for node type "${nodeConfig.type}" is not implemented.`);
  }

  // 4. Fetch and decrypt credentials if the node requires them
  let credentials:ICredentials | undefined;
  if (nodeConfig.credentialsId) {
    // This is a placeholder for your actual decryption logic
    // credentials = await getAndDecryptCredentials(nodeConfig.credentialsId, workflow.authorId);
    const cred = await prisma.credentials.findFirst({where: {id: nodeConfig.credentialsId, authorId: workflow.authorId}})
    credentials = cred?.data as  ICredentials ; // REMEMBER TO DECRYPT THIS
  }
  
  const nodeInput: INodeInput = {
    parameters: nodeConfig.parameters,
    inputData: inputData,
    ...(credentials ? {credentials}:{})
  };

  // 5. Execute the node's logic and return the output
  return nodeImplementation.execute(nodeInput);
};