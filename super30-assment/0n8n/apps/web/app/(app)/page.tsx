import React from 'react'
import { Button } from '@components/ui/button'
import { ChevronDown } from 'lucide-react'

const page = () => {
  return (
    <div>
        <div>
            <div>
                <h1>Dashboard</h1>
                <h4>Workspace and credential own by you</h4>
            </div>
            <div>
                <Button>Create Workflow</Button>
                <button><ChevronDown /></button>
            </div>
        </div>

        <div>
        
        </div>
    </div>
  )
}

export default page
