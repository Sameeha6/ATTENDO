import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HistoryNav from './HistoryNav'
import Subject from '../Student/Subject'
import Sem from '../Student/Sem'
import Hourly from '../Student/Hour'
import StudentNav from './StudentNav'

function ViewHistory() {
  return (
    <div className="min-h-screen flex flex-col">
    <HistoryNav/>
    
   <div className="flex-grow">
    <Routes>
       <Route path="/student/attendance-history/subject" element={<Subject />} />
       <Route path="/student/attendance-history/hour" element={<Hourly />} />
       <Route path="/student/attendance-history/sem" element={<Sem />} />
    </Routes>
    </div>
  </div>
  )
}

export default ViewHistory