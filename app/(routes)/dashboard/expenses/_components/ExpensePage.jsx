"use client";
import React, { useEffect, useState} from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import ExpensesList from "./ExpensesList";
import { ArrowLeft} from "lucide-react";
import { useRouter } from "next/navigation";

function ExpensePage() {
    const { user } = useUser();
    const [expensesList, setExpensesList] = useState([]);
    const router = useRouter();
  
  
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
        getAllExpenses();
      }
    }, [user, getAllExpenses]);
  
    return (
      <div className="p-7">
        <h2 className="flex items-center gap-3 font-bold text-3xl"> <ArrowLeft onClick={() => router.back()} className="font-bold rounded-full hover:bg-slate-200 mr-1"/> My Expenses</h2>
        <ExpensesList expenseList={expensesList} refreshExpenseTable={getAllExpenses} />
      </div>
    );
}

export default ExpensePage
