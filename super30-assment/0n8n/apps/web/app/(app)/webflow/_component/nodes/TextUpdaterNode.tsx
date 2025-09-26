import React, { useCallback } from 'react'

type Props = {}

const TextUpdaterNode = (props: Props) => {
    const onChange=useCallback((e)=>{
        console.log(e.target.value)
    },[])
  return (
    <div className="text-updater-node">
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div>
    </div>

  )
}

export default TextUpdaterNode