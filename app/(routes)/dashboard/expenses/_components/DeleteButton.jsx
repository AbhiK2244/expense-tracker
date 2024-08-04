import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import React from "react";
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
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


function DeleteButton({budgetId}) {

    const route = useRouter();

    const deleteBudget = async() => {
        try{

            const expenseDeleteResult = await db.delete(Expenses).where(eq(Expenses.budgetId, budgetId)).returning();
            
            let result = null;
            if(expenseDeleteResult)
                {
                    result = await db.delete(Budgets).where(eq(Budgets.id, budgetId)).returning();
                }    
                
                console.log("result from delete",result);
                
                if(result)
                    {
                        toast('Budget Deleted')
                        route.replace('/dashboard/budgets');
                    }
        }
        catch(err)
        {
            console.error("Error:",err)
        }
    }
    
    return (
        <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
        <Button variant="destructive">
        <Trash />
      </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              current <span className="text-red-700">budget</span> and <span className="text-red-700">expenses</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteBudget()}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DeleteButton;
