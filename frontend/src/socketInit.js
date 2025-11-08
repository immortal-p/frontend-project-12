import { createSocket } from './socket.js'
import store from './slices/store.js'
import { addMessage, addChannel, deleteChannel, renameChannel } from './slices/chatSlice.js'
import { toast } from 'react-toastify'

export const createSocketManager = () => {
  let socketInstance = null
  let disconnectFn = null

  const initSocket = (t) => {
    if (socketInstance) return socketInstance

    const { socket, disconnect } = createSocket()
    socketInstance = socket
    disconnectFn = disconnect

    socket.on('newMessage', (msg) => {
      if (msg?.id) store.dispatch(addMessage(msg))
    })

    socket.on('newChannel', (channel) => {
      store.dispatch(addChannel(channel))
      toast.success(t('chat.toastify.createChannel'), { draggable: true })
    })

    socket.on('removeChannel', (channelId) => {
      store.dispatch(deleteChannel(channelId))
      toast.success(t('chat.toastify.deleteChannel'), { draggable: true })
    })

    socket.on('renameChannel', (channel) => {
      store.dispatch(renameChannel(channel))
      toast.success(t('chat.toastify.renameChannel'), { draggable: true })
    })

    return socketInstance
  }

  const disconnectSocket = () => {
    if (disconnectFn) {
      disconnectFn()
      socketInstance = null
      disconnectFn = null
    }
  }

  return { initSocket, disconnectSocket }
}
