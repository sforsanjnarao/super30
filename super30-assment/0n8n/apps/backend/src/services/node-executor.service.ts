/*The Brain: node-executor.service.ts (Service Layer)
Responsibility: Execute a single node.
Flow (execute):
Fetches the full Workflow and Execution records from the DB using the executionId.
Finds the specific node's configuration JSON within the workflow.nodes array using the nodeId.
Checks for a credentialsId in the node's config. If it exists,
     it fetches and decrypts the credential data from the Credentials table.
Based on the node.type (e.g., "Telegram", "Email"), it calls the specific execution code for that node.
      This is a great place for a switch statement or a factory pattern.
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




import { AgentNode } from '../nodes/implementations/Agent.node.ts';
import prisma from '../lib/prisma.ts';
import type { ICredentials, INode, INodeInput } from '../nodes/INode.interface.ts';
import { TelegramNode } from '../nodes/implementations/Telegram.node.ts';
import { IfNode } from '../nodes/implementations/If.node.ts';
import { getAndDecryptCredential } from './credential.service.ts'; // Assuming this function exists

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
  console.log(execution.workflow)
  const { workflow } = execution;
  
  // 2. Find the specific node's configuration from the workflow blueprint
  const nodeConfig = (workflow.nodes as any).find((n: any) => n.id === nodeId);
  console.log("nodeConfig",nodeConfig)
  if (!nodeConfig) {
    throw new Error(`Node with ID ${nodeId} not found in workflow definition.`);
  }

  // 3. Find the correct node logic implementation from our registry
  const nodeImplementation = nodeImplementations[nodeConfig.type];
  console.log("nodeImplementation",nodeImplementation)
  if (!nodeImplementation) {
    throw new Error(`Execution logic for node type "${nodeConfig.type}" is not implemented.`);
  }

  // 4. Fetch and decrypt credentials if the node requires them
  let credentials:ICredentials | undefined;
  console.log('workflow.authorId',workflow.authorId)
  if (nodeConfig.credentialsId) {
    console.log('why not')
    credentials = await getAndDecryptCredential(nodeConfig.credentialsId, workflow.authorId) as  ICredentials
  }
  console.log('nodeConfig.credentialsId',nodeConfig.credentialsId)
  console.log('lalal',credentials)

  
  const nodeInput: INodeInput = {
    parameters: nodeConfig.parameters,
    inputData: inputData,
    ...(credentials ? {credentials}:{})
    
  };
  console.log('nodeInput',nodeInput)

  // 5. Execute the node's logic and return the output
  return nodeImplementation.execute(nodeInput);
};