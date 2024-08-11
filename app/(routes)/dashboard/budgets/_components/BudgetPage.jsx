"use client"
import React from 'react'
import BudgetList from './BudgetList'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

function BudgetPage() {
    const router = useRouter();
    return (
      <div className='p-10'>
        <h2 className='font-bold text-3xl flex items-center'> <ArrowLeft onClick={() => router.back()} className=" rounded-full hover:bg-slate-200 mr-1"/> My Budgets</h2>
        <BudgetList/>
      </div>
    )
}

export default BudgetPage
