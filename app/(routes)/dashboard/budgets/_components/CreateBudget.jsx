'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { Budgets } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
  

function CreateBudget({refreshData}) {
    const [emoji, setEmoji] = useState('😊');
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    
    const [name, setName] = useState("");
    const [amount, setAmount] = useState();

    const user = useUser();

    //saving data to databases 
    const saveBudgetToDb = async() => {
        try
        {

            const userEmail = user?.user?.primaryEmailAddress?.emailAddress;
            console.log(userEmail)
            const result = await db.insert(Budgets).values({
                name,
                amount,
                icon:emoji,
                createdBy: userEmail,
            }).returning({insertedId: Budgets.id});
            
            if(result)
            {
                refreshData();
                toast("New Budget Created!")
                setAmount("");
                setName("");
            }
        }
        catch(err)
        {
            console.log("Error: ", err);
        }
    }


  return (
    <div className='cursor-pointer'>
      <Dialog>
        <DialogTrigger asChild>
            <div className='bg-slate-100 p-10 rounded-md flex flex-col items-center border shadow-sm hover:shadow-md'>
                <h2 className='text-3xl cursor-pointer'>+</h2>
                <h2 className='cursor-pointer'>Create New Budget</h2>
            </div>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
                <div className='mt-5'>
                        <Button variant='outline' onClick={() =>{setOpenEmojiPicker(!openEmojiPicker)}} >{emoji}</Button>
                    <div className='absolute z-10'>
                        <EmojiPicker open={openEmojiPicker}
                        onEmojiClick={(e) => {
                            setEmoji(e.emoji);
                            setOpenEmojiPicker(!openEmojiPicker);
                        }}
                        />
                    </div>

                    <div className='mt-2'>
                        <h2 className='text-black font-medium my-1'>Budget Name</h2>
                        <Input type='text' placeholder='ex. Daily Expenses' onChange={(e) => setName(e.target.value)} value={name} />
                    </div>

                    <div className='mt-2'>
                        <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                        <Input type='number' placeholder='ex. ₹ 2000' onChange={(e) => setAmount(e.target.value)} value={amount} />
                    </div>
                    
                </div>
            </DialogDescription>
            </DialogHeader>
            <div className='mt-5 flex justify-end'>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                            <Button disabled={!(name && amount)} onClick={saveBudgetToDb}>Create Budget</Button>
                    </DialogClose>
                </DialogFooter>
            </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default CreateBudget
