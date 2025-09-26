import { Handle } from '@xyflow/react'
import React, { useCallback } from 'react'
import {   Position } from '@xyflow/react';
import { BaseEdge, getStraightPath } from '@xyflow/react';


type Props = {}


//custom handle

export function TargetHandleWithValidation({ position, source}) {
    return (
      <Handle
        type="target" //Loose
        position={position}
        isValidConnection={(connection) => connection.source === source}
        onConnect={(params) => console.log('handle onConnect', params)}
        style={{ background: '#fff' }}
      />
    );
  }

 
  export function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
    const [edgePath] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
   
    return (
      <>
        <BaseEdge id={id} path={edgePath} />
      </>
    );
  }
const TextUpdaterNode = (props: Props) => {
    const onChange=useCallback((e)=>{
        console.log(e.target.value)
    },[])
  return (
    <div className="text-updater-node">
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag nopan" />
      </div>
      <Handle type="source" position="top" />
      <Handle type="target" position="bottom" id="a"/>
    </div>

  )
}

export default TextUpdaterNode



 
