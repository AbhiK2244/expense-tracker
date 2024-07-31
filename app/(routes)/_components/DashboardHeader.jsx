import { UserButton } from '@clerk/nextjs'
import React from 'react'

const DashboardHeader = () => {
  return (
    <div className='p-5 shadow-sm border flex justify-between items-center'>
      <div>
        SideBar
      </div>

      <div>
        <UserButton/>
      </div>
    </div>
  )
}

export default DashboardHeader
