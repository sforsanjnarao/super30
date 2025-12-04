'use client';

import { ReactFlowProvider } from '@xyflow/react';
import { WorkflowEditor } from './WorkflowEditor';

export default function WorkflowEditorWrapper({ workflowId }: { workflowId: string }) {
    return (
        <ReactFlowProvider>
            <WorkflowEditor workflowId={workflowId} />
        </ReactFlowProvider>
    );
}