'use client'
import React, { useEffect } from 'react'
import SideNav from '../_components/SideNav'
import DashboardHeader from '../_components/DashboardHeader'
import { useUser } from '@clerk/nextjs'
import { db } from '@/utils/dbConfig'
import { Budgets } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { useRouter } from 'next/navigation'

const DashboardLayout = ({children}) => {

  const {user, isSignedIn, isLoaded} = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      checkUserBudgets();
    }
  }, [user, isLoaded]);

  const checkUserBudgets = async () => {
    const userEmail = user?.user?.primaryEmailAddress?.emailAddress;
    const result = await db.select().from(Budgets).where(eq(Budgets.createdBy, userEmail));
    // console.log(result.length);

    if(result?.length == 6)
    {
      router.replace('/dashboard/budgets');
    }
  }

  if (!isLoaded) {
    return null;
  }

  if(!isSignedIn)
  {
    // console.log("is ", isSignedIn);
    // console.log("user ", user)
    router.replace("/sign-in")
  } 
  
  return (
    isSignedIn && <div>
        <div className='fixed md:w-64 hidden md:block border shadow-sm'>
            <SideNav/>
        </div>
        <div className='md:ml-64'>
            <DashboardHeader/>
            {children}
        </div>
    </div>
  )
}

export default DashboardLayout