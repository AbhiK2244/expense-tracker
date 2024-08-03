'use client'
import React, { useEffect, useState, useCallback } from 'react'
import CreateBudget from './CreateBudget'
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses } from '@/utils/schema'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import BudgetItems from './BudgetItems'

const BudgetList = () => {
    const [budgetList, setBudgetList] = useState([]);
    const { user } = useUser(); // Destructure user from useUser hook

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
        <div className='mt-7'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                <CreateBudget refreshData={getBudgetList} />
                {budgetList?.length>0 ? budgetList.map((budget, index) => (
                    <BudgetItems budget={budget} key={budget.id} />
                ))
              : <div className='w-full h-[70vh] flex justify-center items-center animate-pulse'>Loading data...</div>
              }
            </div>
        </div>
    )
}

export default BudgetList;
