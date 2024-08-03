"use client"
import React, { useEffect, useCallback, useState } from 'react'
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses } from '@/utils/schema'
import { and, eq, getTableColumns, sql } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import BudgetItems from '../../budgets/_components/BudgetItems'
import AddExpenses from '../_components/AddExpenses'

function expenses({params}) {

    const {user} = useUser();
    const [budgetInfo, setBudgetInfo] = useState({});

    useEffect(() => {
        if(user)
        {
            getBudgetInfo();
        }    
    },[user, params])


    const getBudgetInfo = useCallback(async () => {
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        console.log(userEmail)
        if (!userEmail) {
            console.error("User email not found");
            return;
        }

        try {
            const result = await db.select({
                ...getTableColumns(Budgets),
                totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
                totalItem: sql`count(${Expenses.id})`.mapWith(Number),
            }).from(Budgets).leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId)).where(and(eq(Budgets.createdBy, userEmail),eq(Budgets.id,params.id))).groupBy(Budgets.id);

            setBudgetInfo(result[0]);
            console.log(result);
        } catch (error) {
            console.error("Failed to fetch budgets", error);
        }
    }, [user]);

  return (
    <div className='px-6 py-5'>
      <h2 className='text-2xl font-bold'>My Expenses</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 mt-5 gap-5'>
        {budgetInfo?<BudgetItems budget={budgetInfo}/>: <div className='h-[150px] w-full rounded-lg bg-slate-200 animate-pulse'></div> }
      <AddExpenses refreshExpenseData={getBudgetInfo} budgetId={params.id} userEmail={user?.primaryEmailAddress?.emailAddress}/>
      </div>

    </div>
  )
}

export default expenses
