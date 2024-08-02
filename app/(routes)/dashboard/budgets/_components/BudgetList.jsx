'use client'
import React, { useEffect, useState } from 'react'
import CreateBudget from './CreateBudget'
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses } from '@/utils/schema'
import { eq, getTableColumns, sql } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import BudgetItems from './BudgetItems'

const BudgetList = () => {

  const [budgetList, setBudgetList] = useState([]);
  const user = useUser();

  useEffect(() => {
    user && getBudgetList();
  }, [user]);

  const getBudgetList = async() => {

    const userEmail = user?.user?.primaryEmailAddress?.emailAddress;

    const result = await db.select({
      ...getTableColumns(Budgets),
      totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number),
    }).from(Budgets).leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId)).where(eq(Budgets.createdBy,userEmail)).groupBy(Budgets.id);

    setBudgetList(result);
    console.log(result);
  }

  return (
    <div className='mt-7'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            <CreateBudget/>
            {budgetList.map((budget) => (
              <BudgetItems budget={budget}/>
            ))} 
        </div>
    </div>
  )
}

export default BudgetList
