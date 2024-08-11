"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import CardInfo from "../_components/CardInfo";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import BarChartDashboard from "./BarChartDashboard";
import ExpensesList from "../dashboard/expenses/_components/ExpensesList";
import BudgetItems from "../dashboard/budgets/_components/BudgetItems";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function DashboardPage() {
    const { user } = useUser();
 
    const [budgetList, setBudgetList] = useState([]);
    const [expensesList, setExpensesList] = useState([]);
  
  
    //get budgetList form database
    const getBudgetList = useCallback(async () => {
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      if (!userEmail) {
        console.error("User email not found");
        return;
      }
  
      try {
        const result = await db
          .select({
            ...getTableColumns(Budgets),
            totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
            totalItem: sql`count(${Expenses.id})`.mapWith(Number),
          })
          .from(Budgets)
          .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
          .where(eq(Budgets.createdBy, userEmail))
          .groupBy(Budgets.id)
          .orderBy(desc(Budgets.id));
  
        setBudgetList(result);
        getAllExpenses();
        // console.log(result);
      } catch (error) {
        console.error("Failed to fetch budgets", error);
      }
    }, [user]);
  
  
    //get all the expenses data for database
    const getAllExpenses = async () => {
      try {
        const result = await db
          .select({
            id: Expenses.id,
            name: Expenses.name,
            amount: Expenses.amount,
            createdAt: Expenses.createdAt,
          })
          .from(Budgets)
          .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
          .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
          .orderBy(desc(Expenses.id));
  
        // console.log("Expenses result  ",result);
        setExpensesList(result);
      } catch (err) {
        console.error("Error ", err);
      }
    };
  
    useEffect(() => {
      if (user) {
        getBudgetList();
      }
    }, [user, getBudgetList]);
  
    return (
      <div className="p-7">
        <h2 className="font-bold text-2xl">
          Hi, <span className="text-primary">{user?.fullName}</span>
        </h2>
        <p className="text-gray-500">let us manage your expenses.</p>

        <div className="flex items-center gap-3 md:hidden lg:hidden my-3">
          <Link className='md:hidden lg:hidden' href={'/dashboard/budgets'}><Button>Budgets</Button></Link>
          <Link className='md:hidden lg:hidden' href={'/dashboard/expenses'}><Button>Expenses</Button></Link>
        </div>
  
        <CardInfo budgetList={budgetList} />
  
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2">
            <BarChartDashboard budgetList={budgetList} />
            <div>
              <h2 className="font-bold text-lg mt-5">Latest Expenses</h2>
              <ExpensesList expenseList={expensesList} refreshExpenseTable={getBudgetList} />
            </div>
          </div>
  
          <div className="ml-2 mt-5 md:mt-0">
            <h2 className="font-bold text-xl">Latest Budgets</h2>
            {budgetList.map((budget) => (
              <div key={budget.id} className="mt-3">
                <BudgetItems budget={budget} key={budget.id} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}

export default DashboardPage
