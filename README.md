EchoSync — Real-time Code Collaboration
EchoSync is a minimal, production-ready template for a collaborative code editor built with React (Vite) and Socket.IO. It lets multiple users edit the same document in real-time inside a shared room.

Features
🔗 Room-based collaboration (share the URL to invite others)
🧑‍🤝‍🧑 Live presence list (who’s online)
⚡ Real-time code syncing via WebSockets (Socket.IO)
🧩 Code editor powered by CodeMirror 6 (JavaScript + JSX mode)
🧱 Simple Node/Express server with in-memory state
🧪 Local dev-friendly setup with Vite (port 5170) & server (port 5000)
Note: This template keeps room state in memory. For production, back the document with a database and consider CRDT/OT (like Yjs/ShareDB) for conflict-free editing.

Prerequisites
Node.js 18+ (recommended)
A terminal with two tabs (one for server, one for client)
Quick Start (Local)
Download & unzip this project.
Install & run the server:
cd Echosync/server
npm install
npm run dev   # starts at http://localhost:5000
Install & run the client:
cd ../client
npm install
npm run dev   # Vite at http://localhost:5170
Open the app: Go to http://localhost:5170 in your browser.
Enter your name, click Create new room, and share the URL with collaborators.
Or paste a Room ID to join an existing room.
Step-by-Step Implementation Guide
1. Create the project folders
Echosync/
  server/
  client/
2. Build the WebSocket server
Express hosts a tiny HTTP API.
Socket.IO manages rooms and broadcasts code changes & user presence.
Key events:

JOIN({ roomId, username }) — add a socket to the room and broadcast the updated user list.
CODE_INIT(code) — server sends current room code to the new client.
CODE_CHANGE(code) — broadcast code updates to other clients and update server state.
USERS([{ socketId, username }]) — room presence list.
USER_JOINED / USER_LEFT — simple notifications (you can add toasts).
3. Build the client (React + Vite)
Home.jsx collects username, creates or joins a roomId using React Router.
Room.jsx sets up a socket connection, joins the room, and listens for events:
Apply CODE_INIT once on mount.
Update editor on incoming CODE_CHANGE.
Keep a live users list using USERS.
Editor.jsx wraps CodeMirror 6 with JavaScript+JSX syntax support.
A tiny debounce prevents sending every keystroke as a WebSocket packet.
4. Configure ports & CORS
Server runs at http://localhost:5000 with CORS open to all origins (for local dev).
Client (Vite) runs at http://localhost:5170 (fixed via vite.config.js to avoid port confusion).
5. Test with multiple tabs
Open two browser tabs to the same room URL and watch changes sync instantly.
Environment Variables
Create client/.env (or copy .env.example):

VITE_SERVER_URL=http://localhost:5000
If you deploy the server, change this to your deployed URL.

Production Notes
Put the server behind HTTPS and configure a proper CORS origin list.
Persist room documents in a database.
For conflict-free editing at scale, layer in CRDT (e.g., Yjs) or OT.
Add auth & per-room ACLs for private sessions.
Troubleshooting
Blank page or wrong port? This project pins Vite to 5173. Make sure you open http://localhost:5170.
If you see CORS errors, verify VITE_SERVER_URL matches your server URL and that the server is running.
Node version < 18 can cause dependency issues. Upgrade if needed.
Happy hacking!
