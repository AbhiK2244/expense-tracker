"use client";
import React, { useEffect, useCallback, useState } from "react";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import BudgetItems from "../../budgets/_components/BudgetItems";
import AddExpenses from "./AddExpenses";
import ExpensesList from "./ExpensesList";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

function ExpensesDynamicPage({params}) {
  const { user } = useUser();
  const [budgetInfo, setBudgetInfo] = useState({});
  const [expensesList, setExpensesList] = useState([]);

  useEffect(() => {
    if (user) {
      getBudgetInfo();
    }
  }, [user, params]);

  //fetch all the budget data from database
  const getBudgetInfo = useCallback(async () => {
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
        .where(and(eq(Budgets.createdBy, userEmail), eq(Budgets.id, params.id)))
        .groupBy(Budgets.id);

      setBudgetInfo(result[0]);
      getExpensesInfo();
    } catch (error) {
      console.error("Failed to fetch budgets", error);
    }
  }, [user]);

  //fetch all the expenses data for a particular budget
  const getExpensesInfo = async () => {
    try {
      let result = await db
        .select()
        .from(Expenses)
        .where(eq(Expenses.budgetId, params.id))
        .orderBy(desc(Expenses.id));

      console.log("expense", result);
      setExpensesList(result);
    } catch (err) {
      console.error("Error: fetching the data from database", err);
    }
  };

  return (
    <div className="px-6 py-5">
      <div className="text-2xl font-bold flex items-center justify-between">
        <span>My Expenses</span>
        <div className="flex items-center gap-4">
          <EditButton budgetInfo={budgetInfo} refreshContent={getBudgetInfo} />
          <DeleteButton budgetId={params.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-5">
        {budgetInfo ? (
          <BudgetItems budget={budgetInfo} />
        ) : (
          <div className="h-[150px] w-full rounded-lg bg-slate-200 animate-pulse"></div>
        )}
        <AddExpenses
          refreshExpenseData={getBudgetInfo}
          budgetId={params.id}
          userEmail={user?.primaryEmailAddress?.emailAddress}
        />
      </div>

      <div className="mt-4">
        <h2 className="font-bold text-lg">Expenses</h2>
        <ExpensesList
          refreshExpenseTable={getBudgetInfo}
          expenseList={expensesList}
        />
      </div>
    </div>
  );
}

export default ExpensesDynamicPage
