// "use client";

// import React from "react";
// import { useParams } from "next/navigation";
// import Environment from "../_component/Environment";

// const Page = () => {
//   const params = useParams();
//   const id = params.id as string; 

//   return (
//     <div className="h-screen w-screen">
//       <Environment workflowId={id} />
//     </div>
//   );
// };

// export default Page;

// This is where the magic will happen
// const CanvasArea = () => (
//     <div className="flex-grow h-full bg-muted/40">
//         {/* React Flow will go here */}
//     </div>
// );
import WorkflowEditorWrapper from '@/components/workflow/WorkflowEditorWrapper';

export default async function WorkflowEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <WorkflowEditorWrapper workflowId={id} />
  );
}