import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const DashboardHeader = () => {
  return (
    <div className='p-5 md:hidden shadow-sm border flex justify-between items-center'>
      <div className='flex items-center gap-5'>
      <Image className='md:hidden' src={'/logo.png'} alt='logo' width={160} height={100}/>
      </div>

      <div>
        <UserButton/>
      </div>
    </div>
  )
}

export default DashboardHeader
