"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { UserDetailContext } from '@/context/UserDetailcontext'
function Provider({ children }: { children: React.ReactNode }) {
    const [userDetail, setUserDetail] = useState()
    useEffect(() => {
        createNewUser()
    }, [])
    const createNewUser = async() => {
        const result = await axios.post('/api/user', {})
        console.log(result.data)
        setUserDetail(result?.data)
    }
  return (
    <UserDetailContext value={{userDetail,setUserDetail}}>
    <div>{children}</div>
    </UserDetailContext>
  )
}

export default Provider