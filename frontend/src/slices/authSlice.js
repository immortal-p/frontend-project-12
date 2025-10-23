import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    token: localStorage.getItem("token") || null,
    user: localStorage.getItem("username") || null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { token, user } = action.payload
            if(token) {
                state.token = token,
                state.user = user,
                localStorage.setItem("token", token)
                localStorage.setItem("username", user)
            }
        },
        logout: (state) => {
            state.token = null,
            state.user = null,
            localStorage.removeItem("token")
            localStorage.removeItem("username")
        }
    }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer