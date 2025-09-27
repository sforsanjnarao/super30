import React from 'react'
// import {ResizablePanelGroup,ResizablePanel,ResizableHandle} from ''
import Button from "@components/ui/button"


const page = () => {
  return (
    <ResizablePanelGroup direction='vertical'
    className="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]"
    >
        <Button>+ Create credentials </Button>

        
    </ResizablePanelGroup>
  )
}

export default page