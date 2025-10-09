import React from 'react'

const layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
        {children}
    </div>
  )
}

export default layout

