import React from 'react'
import Agent from '@/components/Agent'
const page = () => {
  return (
    <>
        <h3>Interview Generation</h3>

        <Agent userName="John Doe"  userId='user1' type='generate'/>
        {/* <Agent/> */}
    </>
  )
}

export default page