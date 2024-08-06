'use client'
import { IndianRupee, ReceiptText, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function CardInfo({budgetList}) {

    const [totalAmounts, setAmounts] = useState({totalBudget: 0, totalSpent: 0});

    const calculateAmounts = () => {
        let totalBudget = 0;
        let totalSpent = 0;

        budgetList.forEach(element => {
            totalBudget += Number(element.amount);
            totalSpent += element.totalSpend;
        });
        console.log(totalBudget, totalSpent)
        setAmounts({totalBudget, totalSpent});
        

    }

    useEffect(() => {
        if(budgetList)
        {
            calculateAmounts();
        }
    },[budgetList])

  return (
    <div>
        {budgetList?<div className='mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            <div className='p-5 rounded-md border shadow-sm hover:shadow-md flex items-center justify-between'>
                <div>
                    <h2 className='text-sm'>Total Budget</h2>
                    <h2 className='font-bold text-2xl'>₹ {totalAmounts.totalBudget}</h2>
                </div>

                <IndianRupee className='bg-primary p-3 text-white w-12 h-12 rounded-full flex items-center justify-center' />
            </div>

            <div className='p-5 rounded-md border shadow-sm hover:shadow-md flex items-center justify-between'>
                <div>
                    <h2 className='text-sm'>Total Expense</h2>
                    <h2 className='font-bold text-2xl'>₹ {totalAmounts.totalSpent}</h2>
                </div>

                <ReceiptText className='bg-primary p-3 text-white w-12 h-12 rounded-full flex items-center justify-center' />
            </div>

            <div className='p-5 rounded-md border shadow-sm hover:shadow-md flex items-center justify-between'>
                <div>
                    <h2 className='text-sm'>Number of Budget</h2>
                    <h2 className='font-bold text-2xl'>{budgetList?.length}</h2>
                </div>

                <Wallet className='bg-primary p-3 text-white w-12 h-12 rounded-full flex items-center justify-center' />
            </div>
        </div>
        :
        <div className='h-[40vh] w-full flex justify-center items-center'>Loading...</div>
        }
    </div>
  )
}

export default CardInfo
