"use client"
import React from 'react'
import { DashboardHeader } from '../_component/header';
import { MainNav } from '../_component/main-nav';
import {  redirect, usePathname } from 'next/navigation';
import { getUser} from '@lib/cookies';



async function checkUser(){
 const user =await getUser()
 if(!user) redirect('/login')
}
const showNavBarRoutes=["/credentials", "/workflow"]
export default  function Layout({children}:{children: React.ReactNode;}) {
   checkUser()
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
