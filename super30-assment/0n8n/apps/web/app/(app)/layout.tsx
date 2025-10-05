"use client"
import React from 'react'
import { DashboardHeader } from '../_component/header';
import { MainNav } from '../_component/main-nav';
import { usePathname } from 'next/navigation';

// interface LayoutType{
//   children: React.ReactNode
// }
const showNavBarRoutes=["/credentials", "/workflow"]
export default function Layout({children}:{children: React.ReactNode;}) {
  const pathname=usePathname()
  const showNavBar=showNavBarRoutes.some(routes=>pathname.startsWith(routes))

  return (
          <div>
            {showNavBar && <DashboardHeader/>} 
            {showNavBar && <MainNav />}  

            
            
            <main>{children}</main>
          </div>
  );
}

//question for today 
//what usePathname
//how some function work
// in typescript what ReadOnly do
