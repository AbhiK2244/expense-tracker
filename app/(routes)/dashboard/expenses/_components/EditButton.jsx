'use client'
import React, { useEffect, useState } from 'react'
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
import { toast } from 'sonner';
import { PenBox } from 'lucide-react'
import { eq } from 'drizzle-orm';


function EditButton({budgetInfo, refreshContent}) {


    const [emoji, setEmoji] = useState(budgetInfo?.icon);
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    
    const [name, setName] = useState(budgetInfo?.name);
    const [amount, setAmount] = useState(budgetInfo?.amount);


    //updating data in database
    const updateBudget = async() => {
        try
        {
            const result = await db.update(Budgets).set({
            name,
            amount,
            icon:emoji
            }).where(eq(Budgets.id, budgetInfo.id)).returning();

            if(result)
            {
                // console.log("update result",result);
                toast('Budget Updated');
                refreshContent();
            }
        }
        catch(err)
        {
            console.error("Error:", err);
        }
    }

    useEffect(() => {
        if (budgetInfo) {
            setEmoji(budgetInfo?.icon || '');
            setName(budgetInfo?.name || '');
            setAmount(budgetInfo?.amount || '');
        }
    }, [budgetInfo]);


  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
            <Button title='Edit Budget'><PenBox/></Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Update Budget</DialogTitle>
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
                        <Input type='text' placeholder='ex. Daily Expenses' onChange={(e) => setName(e.target.value)} value={name}/>
                    </div>

                    <div className='mt-2'>
                        <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                        <Input type='number' placeholder='ex. ₹ 2000' onChange={(e) => setAmount(e.target.value)} value={amount}/>
                    </div>
                    
                </div>
            </DialogDescription>
            </DialogHeader>
            <div className='mt-5 flex justify-end'>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                            <Button disabled={!(name && amount)} onClick={updateBudget}>Update Budget</Button>
                    </DialogClose>
                </DialogFooter>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EditButton
