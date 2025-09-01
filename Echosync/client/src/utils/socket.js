// (Optional) Not used in this template; keeping here for future extension.
// You can import this and reuse the socket across components.
import { io } from 'socket.io-client'
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'
export const socket = io(SERVER_URL, { transports: ['websocket'] })
