import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const { token } = useSelector(state => state.auth)
  const navigate = useNavigate()

  if (!token) navigate('/signin')
    
  return <Outlet />
}

export default ProtectedRoute
