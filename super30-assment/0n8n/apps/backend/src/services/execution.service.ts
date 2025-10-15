/*The Conductor: execution.service.ts (Service Layer)
Responsibility: Manage the state of a workflow execution as a whole.
Flow (startWorkflowFromWebhook):
Uses prisma.workflow.findUnique(...) to find the workflow by its webhookId.
If not found or inactive, it throws an error.
Uses prisma.execution.create(...) to create a new Execution record in the database with status: 'running'.
Finds the starting node(s) of the workflow.
Calls queue.service.ts to add the first job(s) to the queue.
Returns the new Execution object to the controller.*/
