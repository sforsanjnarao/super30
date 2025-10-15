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