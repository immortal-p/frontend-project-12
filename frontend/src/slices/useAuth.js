import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setCredentials } from './authSlice'
import { useTranslation } from 'react-i18next'

export const useAuth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [status, setStatus] = useState(null)

    const extended = async (url, username, password) => {
        setStatus(null)

        try {
            const response = await axios.post(url, { username, password })
            const { token } = response.data
            if (token) {
                dispatch(setCredentials({ token, username }))
                localStorage.setItem('token', token)
                localStorage.setItem('username', username)
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
            else if (err.response?.status === 401) {
                setStatus(t('auth.errors.invalidCredentials'))
            }
            else {
                setStatus(t('auth.errors.connectionError'))
            }
        }
    }
    return { extended, status }
}
