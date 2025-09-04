import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import Editor from '../components/Editor.jsx'
import ClientList from '../components/ClientList.jsx'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'

export default function Room() {
  const { roomId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const username = useMemo(() => {
    const name = location.state?.username || localStorage.getItem('echosync:username') || ''
    if (!name) alert('Please enter your name on the home page.')
    return name
  }, [location.state])

  const [users, setUsers] = useState([])
  const [code, setCode] = useState('// Welcome to EchoSync!\n// Start typing and share the room link.\n\nfunction greet(name) {\n  return `Hello, ${name}!`\n}\n\nconsole.log(greet("EchoSync"))\n')
  const [status, setStatus] = useState('Connecting…')

  const socketRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    const s = io(SERVER_URL, { transports: ['websocket'] })
    socketRef.current = s

    s.on('connect', () => {
      setStatus('Connected')
      s.emit('JOIN', { roomId, username })
    })

    s.on('CODE_INIT', (initial) => {
      if (typeof initial === 'string') setCode(initial)
    })

    s.on('CODE_CHANGE', (incoming) => {
      if (typeof incoming === 'string') setCode(incoming)
    })

    s.on('USERS', (list) => setUsers(list || []))

    s.on('USER_JOINED', ({ username }) => {
      // optional toast; keeping simple
      console.log(username, 'joined')
    })

    s.on('USER_LEFT', ({ username }) => {
      console.log(username, 'left')
    })

    s.on('disconnect', (reason) => {
      setStatus('Disconnected: ' + reason)
    })

    return () => {
      s.disconnect()
    }
  }, [roomId, username])

  const handleChange = (val) => {
    setCode(val)
    // Lightweight debounce to reduce event spam
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      socketRef.current?.emit('CODE_CHANGE', { roomId, code: val })
    }, 120)
  }

  const copyLink = async () => {
    const url = window.location.href
    try { await navigator.clipboard.writeText(url); alert('Room link copied!') }
    catch { prompt('Copy this link', url) }
  }

  const leave = () => navigate('/')

  return (
    <div className="room">
      <aside className="sidebar">
        <div className="top">
          <h2>People</h2>
          <span className="notice">{users.length}</span>
        </div>
        <ClientList users={users} meId={socketRef.current?.id} />
        <div style={{ flex: 1 }} />
        <button className="btn" onClick={copyLink}>Copy room link</button>
        <div style={{ height: 8 }} />
        <button className="btn danger" onClick={leave}>Leave room</button>
      </aside>

      <section className="editor">
        <div className="toolbar">
          <strong>Room:</strong>&nbsp;{roomId}
          <div className="spacer" />
          <span className="status">{status}</span>
        </div>
        <Editor value={code} onChange={handleChange}
          userName={username} roomId={roomId} />/>
        <footer>EchoSync • Built with React, Vite &amp; Socket.IO</footer>
      </section>
    </div>
  )
}
