
import { useState } from 'react'
import './App.css'
import EmployeeDashboard from './Page/Dashboard/EmployeeDashboard'
import type { User } from './defination/leave'


function App() {
    const [currentUser] = useState<User>({
    id: "admin1",
    name: "Admin User",
    role: "employee", // Change to "employee" to see employee dashboard
    email: "admin@company.com",
    department: "Administration",
    position: "System Administrator",
    joinDate: "2022-01-01",
    isActive: true,
    employeeId: "ADM001",
    phone: "+1234567890",
  })

  return (
    <>
   <EmployeeDashboard currentUser={currentUser} />
    </>
   
  )
}

export default App
