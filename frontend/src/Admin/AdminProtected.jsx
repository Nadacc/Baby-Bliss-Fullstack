import React from 'react'
import { useSelector } from 'react-redux'

import { Navigate } from 'react-router-dom'

function AdminProtected({children}) {
    const logged = useSelector(state => state.admin.logged)
  return (
    logged ? children :<Navigate to='/login' />
  )
}

export default AdminProtected