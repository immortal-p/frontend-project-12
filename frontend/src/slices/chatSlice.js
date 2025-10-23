import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchChannels = createAsyncThunk(
    'chat/fetchChannels',
    async (_, { rejectWithValue}) => {
        try {
            const response = await axios.get('/api/v1/channels')
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Ошибка загрузки каналов')
        }
    }
)

export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()
            const token = auth.token
            const response = await axios.get('/api/v1/messages', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response.data

        } catch (error) {
            return rejectWithValue(error.response?.data || 'Ошибка загрузки сообщений')
        }
    }
)

const initialState = {
    channels: [],
    messages: [],
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        clearError: (state) => { state.error = null}
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChannels.fulfilled, (state, action) => {
                state.loading = false
                state.channels = action.payload
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.messages = action.payload
            })
    }
})

export const { clearError } = chatSlice.actions
export default chatSlice.reducer