import React from 'react'

function BudgetItems({budget}) {
  return (
    <div className='p-5 border rounded-lg shadow-sm hover:shadow-md cursor-pointer'>
        <div className='flex gap-2 items-center justify-between'>
            <div className='flex gap-2 items-center'>
                <h2 className='text-2xl p-3 bg-slate-100 rounded-full'>{budget?.icon}</h2>

                <div>
                    <h2 className='font-bold'>{budget.name}</h2>
                    <h2 className='text-sm text-gray-500'>{budget.totalItem} Item</h2>
                </div>

            </div>

            <h2 className='font-bold text-primary text-lg'>₹{budget.amount}</h2>
        </div>

        <div className='m-5'>
            <div className='flex items-center justify-between mb-1'>
                <h2 className='text-xs text-gray-500'>₹{budget.totalSpend?budget.totalSpend:0} spent</h2>
                <h2 className='text-xs text-gray-500'>remains ₹{budget.amount - budget.totalSpend}</h2>
            </div>

            <div className='w-full h-2 bg-slate-300 rounded-full'>
                <div className='w-[50%] h-2 bg-primary rounded-full'></div>
            </div>
        </div>
    </div>
  )
}

export default BudgetItems
