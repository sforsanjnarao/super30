import React from 'react'

interface LayoutType{
  children: React.ReactNode
}

const layout = ({children}: LayoutType) => {
  return (
    <div>
      <div>lalla</div>
        {children}
    </div>
  )
}

export default layout