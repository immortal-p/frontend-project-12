import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setCredentials } from './authSlice'
import { useTranslation } from 'react-i18next'

export const useAuth = () => {
    const dispath = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [status, setStatus] = useState(null)

    const signup = async (username, password) => {
        setStatus(null)

        try {
            const response = await axios.post('/api/v1/signup', { username, password })
            const { token, username: user } = response.data

            if (token) {
                dispath(setCredentials({ token, username: user }))
                localStorage.setItem('token', token)
                localStorage.setItem('username', user)
                navigate('/')
            }
            else {
                setStatus(t('auth.errors.noToken'))
            }
        }
        catch (err) {
            if (err.response?.status === 409) {
                setStatus(t('auth.errors.userExists'))
            }
            else {
                setStatus(t('auth.errors.connectionError'))
            }
        }
    }
    return { signup, status }
}
