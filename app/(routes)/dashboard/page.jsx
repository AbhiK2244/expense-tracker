'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import CardInfo from '../_components/CardInfo';
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses } from '@/utils/schema'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import BarChartDashboard from '../_components/BarChartDashboard';


export default function page() {

  const {user} = useUser();

  const [budgetList, setBudgetList] = useState([]);

  const getBudgetList = useCallback(async () => {
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      if (!userEmail) {
          console.error("User email not found");
          return;
      }

      try {
          const result = await db.select({
              ...getTableColumns(Budgets),
              totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
              totalItem: sql`count(${Expenses.id})`.mapWith(Number),
          }).from(Budgets).leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId)).where(eq(Budgets.createdBy, userEmail)).groupBy(Budgets.id).orderBy(desc(Budgets.id));

          setBudgetList(result);
          console.log(result);
      } catch (error) {
          console.error("Failed to fetch budgets", error);
      }
  }, [user]);

  useEffect(() => {
      if (user) {
          getBudgetList();
      }
  }, [user, getBudgetList]);

  return (
    <div className='p-7'>
      <h2 className='font-bold text-2xl'>Hi, <span className='text-primary'>{user?.fullName}</span></h2>
      <p className='text-gray-500'>let's manage your expenses.</p>

      <CardInfo budgetList={budgetList}/>

      <div className='mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        <div className='md:col-span-2'>
          <BarChartDashboard budgetList={budgetList}/>
        </div>

        <div>
          Other content
        </div>
      </div>
    </div>
  )
}
