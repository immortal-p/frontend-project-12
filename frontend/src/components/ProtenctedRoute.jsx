import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const { token } = useSelector(state => state.auth)
  const navigate = useNavigate()

  (useEffect(() => {
    if (!token) {
      navigate('/signin')
    }
  }),
  [token])

  if (!token) return null

  return <Outlet />
}

export default ProtectedRoute
