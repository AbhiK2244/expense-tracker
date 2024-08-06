import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { Loader } from "lucide-react";
import moment from "moment/moment";
import React, { useState } from "react";
import { toast } from "sonner";

function AddExpenses({budgetId, userEmail, refreshExpenseData}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const saveExpenseToDB = async () => {
    setLoading(true);
    let result = await db.insert(Expenses).values({
        name,
        amount,
        budgetId,
        createdAt: moment().format('DD/MM/YYYY')
    }).returning({insertedId: Budgets.id});

    if(result)
    {
      setLoading(false);
        toast('New Expense Added');
        setAmount("");
        setName("");
        refreshExpenseData();
    }
    setLoading(false);
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
        <Button onClick={saveExpenseToDB} disabled={!(name && amount)}>
          {loading? <Loader className="animate-spin"/> : "Add"}
          </Button>
      </div>
    </div>
  );
}

export default AddExpenses;
