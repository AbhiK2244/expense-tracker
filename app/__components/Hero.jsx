"use client"
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export default function Hero() {
  const {isSignedIn} = useUser();
  return (
    <section className="bg-gray-50 flex items-center flex-col">
  <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex">
    <div className="mx-auto max-w-xl text-center">
      <h1 className="text-3xl font-extrabold sm:text-5xl">
        Manage Your Expense
        <strong className="font-extrabold text-primary sm:block"> Control Your Money </strong>
      </h1>

      <p className="mt-4 sm:text-xl/relaxed">
        Start managing your budget and save money
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
      {isSignedIn ? <div className='flex justify-end gap-3 items-center'> <Link  href={'/dashboard'}><Button>Start Creating Budgets</Button></Link></div>: 
      <Link href={"/sign-in"}>
       <Button>Get Started Now</Button>
      </Link> 
      }

       
      </div>
    </div>
  </div>

  <Image className='-mt-10 mb-5 rounded-xl border-2' src={'/dashboard.png'} width={800} height={600} alt='dashboard' />
</section>
  )
}
