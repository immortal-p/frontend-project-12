import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()

    useEffect(() => {
        if(!token) {
            navigate('/login')
        }

    }), [ token, navigate ]

    return token ? <Outlet /> : null
}

export default ProtectedRoute