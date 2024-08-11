"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

const Header = () => {

  const {user, isSignedIn} = useUser();

  return (
    <div className='p-5 flex justify-between items-center border shadow-sm'>
      <Image src={'/logo.png'} alt='logo' width={160} height={100}/>

      {isSignedIn ? <div className='flex justify-end gap-3 items-center'> <Link href={'/dashboard'}><Button>Dashboard</Button></Link> <UserButton/></div>: 
      <Link href={"/sign-in"}>
        <Button>Sign in</Button>
      </Link> 
      }
      
    </div>
  )
}

export default Header
