"use client";

import React from "react";
import { useParams } from "next/navigation";
import Environment from "../_component/Environment";

const Page = () => {
  const params = useParams();
  const id = params.id as string; 

  return (
    <div className="h-screen w-screen">
      <Environment workflowId={id} />
    </div>
  );
};

export default Page;