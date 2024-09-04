import { db } from '@/utils/dbConfig'
import { Expenses } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Trash } from 'lucide-react' 
import React from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function ExpensesList({expenseList, refreshExpenseTable}) {

    const deleteExpense = async(expense) => {
        const result = await db.delete(Expenses).where(eq(Expenses.id, expense.id)).returning();

        if(result)
        {
            toast("Expense Deleted");
            refreshExpenseTable();
        }
    }

  return (
    <div className='mt-3'>
      <div className='grid grid-cols-4 bg-slate-200 p-2'>
        <h2 className='font-bold'>Name</h2>
        <h2 className='font-bold'>Amount</h2>
        <h2 className='font-bold'>Date</h2>
        <h2 className='font-bold'>Action</h2>
      </div>
      {expenseList.map((expense) => (
        <div key={expense.id} className='grid grid-cols-4 bg-slate-100 p-2'>
        <h2>{expense.name}</h2>
        <h2>{expense.amount}</h2>
        <h2>{expense.createdAt}</h2>
        <h2 className='flex justify-start' title='Delete item'>
          <AlertDialog>
              <AlertDialogTrigger asChild>
              <Trash className='text-red-400 cursor-pointer ml-5' />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this <span className="text-red-700">expense</span>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction  onClick={() => deleteExpense(expense)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
        </h2>
      </div>
      ))}
    </div>
  )
}

export default ExpensesList
