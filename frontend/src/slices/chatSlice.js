import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchChannels = createAsyncThunk(
  'chat/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/v1/channels')
      return response.data
    }
    catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка загрузки каналов')
    }
  },
)

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/v1/messages')
      return response.data
    }
    catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка загрузки сообщений')
    }
  },
)

const initialState = {
  channels: {
    items: [],
    status: 'idle',
    error: null,
  },
  messages: {
    items: [],
    status: 'idle',
    error: null,
  },
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const msg = action.payload
      state.messages.items.push(msg)
    },
    addChannel: (state, action) => {
      const newChannel = action.payload
      state.channels.items.push(newChannel)
    },
    deleteChannel: (state, action) => {
      const delChannelId = action.payload.id
      state.channels.items = state.channels.items.filter(chan => chan.id !== delChannelId)
    },
    renameChannel: (state, action) => {
      const { id, name } = action.payload
      const channel = state.channels.items.find(ch => ch.id === id)
      if (channel) channel.name = name
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        ;((state.channels.status = 'loading'), (state.channels.error = null))
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.channels.status = 'succeeded'
        state.channels.items = action.payload
      })
      .addCase(fetchChannels.rejected, (state, aciton) => {
        ;((state.channels.status = 'failed'), (state.channels.error = aciton.payload.message))
      })
      .addCase(fetchMessages.pending, (state) => {
        ;((state.messages.status = 'loading'), (state.messages.error = null))
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages.status = 'succeeded'
        state.messages.items = action.payload
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        ;((state.messages.status = 'failed'), (state.messages.error = action.payload.message))
      })
  },
})

export const { clearError, addMessage, addChannel, deleteChannel, renameChannel }
  = chatSlice.actions
export default chatSlice.reducer
