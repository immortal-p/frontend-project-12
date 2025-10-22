import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    token: localStorage.getItem("token") || null,
    user: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { token, user } = action.payload
            if(token) {
                state.token = token,
                state.user = user || null,
                localStorage.setItem("token", token)
            }
        },
        logout: (state) => {
            state.token = null,
            state.user = null,
            localStorage.removeItem("token")
        }
    }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer