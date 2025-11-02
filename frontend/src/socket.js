import { io } from "socket.io-client"

let socket = null

export const connectSocket = () => {
  if (!socket) {
    socket = io('/socket.io', { transports: ['websocket']})
  }
  return socket
}