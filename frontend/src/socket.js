import { io } from "socket.io-client"

let socket = null

export const connectSocket = () => {
  if (!socket) {
    socket = io("ws://localhost:5001", { transports: ["websocket"] })
  }
  return socket
}
