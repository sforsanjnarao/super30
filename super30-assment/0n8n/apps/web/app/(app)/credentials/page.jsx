import React from 'react'
import {ResizablePanelGroup,ResizablePanel,ResizableHandle} from '../../../components/ui/resizable'
import {Button} from "../../../components/ui/button"


const page = () => {
  return (
    <ResizablePanelGroup direction='horizontal'
    className="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]"
    >
              <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Header</span>
        </div>
      </ResizablePanel>

        <Button>+ Create credentials </Button>

        
    </ResizablePanelGroup>
  )
}

export default page