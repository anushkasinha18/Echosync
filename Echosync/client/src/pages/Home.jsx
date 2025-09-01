import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'

export default function Home() {
  const navigate = useNavigate()
  const [username, setUsername] = useState(localStorage.getItem('echosync:username') || '')
  const [roomId, setRoomId] = useState('')

  useEffect(() => {
    localStorage.setItem('echosync:username', username)
  }, [username])

  const createRoom = () => {
    const id = nanoid(8)
    navigate(`/room/${id}`, { state: { username } })
  }

  const joinRoom = () => {
    if (!roomId.trim()) return alert('Enter a Room ID to join')
    navigate(`/room/${roomId.trim()}`, { state: { username } })
  }

  return (
    <div className="container">
      <div className="card">
        <h1>EchoSync</h1>
        <div className="notice">Realtime code collaboration </div>

        <div style={{ height: 16 }} />

        <label>Your name</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. Username" />

        <div style={{ height: 16 }} />

        <div className="row">
          <button className="btn primary" onClick={createRoom} disabled={!username.trim()}>Create new room</button>
          <span className="notice">— or —</span>
          <input style={{ flex: 1, minWidth: 220 }} type="text" value={roomId} onChange={e => setRoomId(e.target.value)} placeholder="Enter Room ID to join" />
          <button className="btn" onClick={joinRoom} disabled={!username.trim()}>Join</button>
        </div>

        <div style={{ height: 16 }} />
        <div className="notice">Tip: Send your room link to collaborators so they can join instantly.</div>
      </div>
    </div>
  )
}
