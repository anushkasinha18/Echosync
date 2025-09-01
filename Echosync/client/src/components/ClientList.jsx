export default function ClientList({ users, meId }) {
  return (
    <div className="users">
      {users.map((u) => (
        <div key={u.socketId} className={'user' + (u.socketId === meId ? ' me' : '')}>
          {u.username || 'Anonymous'} {u.socketId === meId ? '(you)' : ''}
        </div>
      ))}
      {users.length === 0 && <div className="notice">No one here yet…</div>}
    </div>
  )
}
