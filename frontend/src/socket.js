import { io } from 'socket.io-client'

export const createSocket = (() => {
  let socket = null

  return () => {
    if (!socket) {
      socket = io('ws://localhost:5001', { transports: ['websocket'] })
    }
    const disconnect = () => {
      if (socket) {
        socket.disconnect()
        socket = null
      }
    }
    return { socket, disconnect }
  }
})()
