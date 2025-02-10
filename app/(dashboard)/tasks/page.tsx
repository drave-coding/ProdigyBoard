import TaskContent from '@/components/taskArea/taskContent'
import TaskTopSection from '@/components/taskArea/taskTopSection'
import React from 'react'
const TaskArea = () => {
  return (
    <div className=" max-w-screen-2xl mx-auto w-full pl-10 pr-10 pb-10 pt-3 " >
     <TaskTopSection/>
     <TaskContent/>
    </div>
    
  )
}
export default TaskArea