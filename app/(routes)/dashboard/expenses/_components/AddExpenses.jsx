import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import React, { useState } from "react";
import { toast } from "sonner";

function AddExpenses({budgetId, userEmail, refreshExpenseData}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const saveExpenseToDB = async () => {
    let result = await db.insert(Expenses).values({
        name,
        amount,
        budgetId,
        createdAt: userEmail
    }).returning({insertedId: Budgets.id});

    if(result)
    {
        toast('New Expense Added');
        console.log(result);
        setAmount("");
        setName("");
        refreshExpenseData();
    }
  }

  return (
    <div className="border shadow-sm hover:shadow-md rounded-lg p-5">
      <h2 className="text-lg font-bold">Add Expense</h2>

      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Name</h2>
        <Input
          type="text"
          placeholder="ex. Samosa Chat"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>

      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Amount</h2>
        <Input
          type="number"
          placeholder="ex. ₹ 50"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
      </div>

      <div className="mt-5 flex items-center justify-end">
        <Button onClick={saveExpenseToDB} disabled={!(name && amount)}>Add</Button>
      </div>
    </div>
  );
}

export default AddExpenses;
