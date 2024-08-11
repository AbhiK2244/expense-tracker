"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const SideNav = () => {
    const menuList = [
        {
            id:1,
            name:"Dashboard",
            icon: LayoutGrid,
            path:"/dashboard",
        },
        {
            id:2,
            name:"Budgets",
            icon: PiggyBank,
            path:"/dashboard/budgets",
        },
        {
            id:3,
            name:"Expenses",
            icon: ReceiptText,
            path:"/dashboard/expenses",
        },
    ]

    const path = usePathname();

    useEffect(() => {
        console.log(path); 
    },[path])

  return (
    <div className='h-screen p-5'>
      <Image src={'/logo.png'} alt='logo' width={160} height={100}/>

        <div className='mt-4'>
            {menuList.map((menu, index) => 
                (  
                    <Link key={menu.id} href={menu.path}>
                        <h2 className={`flex gap-2 items-center p-5 mb-2 text-gray-500 font-medium cursor-pointer hover:text-primary hover:bg-blue-100 ${path == menu.path && "text-primary bg-blue-100"}`}>
                            <menu.icon/>
                            {menu.name}
                        </h2>
                    </Link>
                )
            )}
        </div>

        <div className='fixed bottom-10 p-5 flex gap-2 items-center'>
            <UserButton />
            <span className='text-gray-700'>profile</span>
        </div>

    </div>
  )
}

export default SideNav
