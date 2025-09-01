import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Room from './pages/Room.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomId" element={<Room />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
