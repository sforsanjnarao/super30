// import React from 'react'

// const layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   return (
//     <div>
//         {children}
//     </div>
//   )
// }

// export default layout

import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </main>
  );
}