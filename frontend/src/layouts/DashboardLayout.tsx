import React from 'react'
import Sidebar from '@/components/common/Sidebar'

const DashboardLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  )
}

export default DashboardLayout
