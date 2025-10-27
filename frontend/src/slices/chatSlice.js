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
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/v1/messages')
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
        clearError: (state) => { state.error = null},
        addMessage: (state, action) => {
            const msg = action.payload
            if (!state.messages.find(m => m.id === msg.id)) {
                state.messages.push(msg)
            }
        },
        addChannel: (state, action) => {
            const newChannel = action.payload
            if(!state.channels.find(ch => ch.id === newChannel.id)) {
                state.channels.push(newChannel)
            }
        },
        deleteChannel: (state, action) => {
            const delChannelId = action.payload.id
            state.channels = state.channels.filter(chan => chan.id !== delChannelId)
        },
        renameChannel: (state, action) => {
            const { id, name } = action.payload
            const channel = state.channels.find(ch => ch.id === id)
            if (channel) channel.name = name
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChannels.fulfilled, (state, action) => {
                state.channels = action.payload
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.messages = action.payload
            })
    }
})

export const { clearError, addMessage, addChannel, deleteChannel, renameChannel } = chatSlice.actions
export default chatSlice.reducer