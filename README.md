# Yap 🎥

A modern 6-person video chat application built with WebRTC mesh networking. Connect face-to-face with up to 5 other people in high-quality peer-to-peer video calls with real-time messaging.

![Video Chat Demo](https://img.shields.io/badge/WebRTC-Powered-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-ES6_Modules-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

## ✨ Features

- **6-Person Video Chat**: WebRTC mesh networking for direct peer-to-peer connections
- **Real-time Messaging**: Integrated chat alongside video calls
- **Modern Dark UI**: "Slate Studio" design system with Tailwind CSS
- **Responsive Layout**: Dynamic video grid that adapts from 1-6 participants  
- **Audio/Video Controls**: Toggle camera and microphone with visual feedback
- **User Authentication**: Secure Auth0 integration
- **Human-Readable Room Names**: Auto-generated room names (e.g., "brave-blue-tiger")
- **Mobile Responsive**: Works across desktop, tablet, and mobile devices

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript, Tailwind CSS, Auth0, Socket.IO Client
- **Backend**: Node.js + Express (ES6 modules), MongoDB + Mongoose, Socket.IO
- **Real-time**: WebRTC for video/audio, Socket.IO for signaling
- **Database**: MongoDB with Mongoose ODM
- **Deployment**: Render.com ready

### WebRTC Implementation
- **Mesh Topology**: Each user connects directly to every other user (P2P)
- **Signaling Server**: Socket.IO handles offer/answer/ICE candidate exchange
- **Media Management**: Custom hooks for stream handling and peer connections
- **Graceful Degradation**: Fallback UI when video is disabled

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yap
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://127.0.0.1:27017/yap
   
   # Auth0 Configuration (optional for development)
   AUTH0_DOMAIN=your-auth0-domain
   AUTH0_CLIENT_ID=your-auth0-client-id
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   ```

4. **Database Setup**
   
   **Local MongoDB:**
   ```bash
   # Install MongoDB Community Edition
   # macOS (with Homebrew)
   brew install mongodb-community
   brew services start mongodb-community
   
   # Linux (Ubuntu/Debian)
   sudo apt-get install -y mongodb
   sudo systemctl start mongod
   
   # Windows
   # Download and install from: https://www.mongodb.com/try/download/community
   ```
   
   **Or use MongoDB Atlas (Cloud):**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a cluster and get connection string
   - Update `MONGODB_URI` in `.env` with your Atlas connection string

### Running the Application

1. **Start MongoDB** (if using local installation)
   ```bash
   # macOS/Linux
   mongod
   
   # Or if installed via Homebrew
   brew services start mongodb-community
   ```

2. **Start the backend server**
   ```bash
   npm start
   ```
   Server will run on `http://localhost:3001`

3. **Start the frontend** (in a new terminal)
   ```bash
   cd client
   npm start
   ```
   Client will run on `http://localhost:3000`

4. **Access the application**
   - Open `http://localhost:3000` in your browser
   - Create or join a room to start video chatting!

## 🛠️ Development

### Available Scripts

**Backend (root directory):**
```bash
npm start          # Start the Node.js server
```

**Frontend (client directory):**
```bash
npm start          # Start development server
npm run build      # Production build
npm test           # Run tests in watch mode
```

### Project Structure

```
yap/
├── server.js              # Main server entry point
├── models/                # MongoDB schemas
│   ├── User.js
│   ├── Room.js
│   └── Message.js
├── routes/                # Express API routes
│   ├── roomRoutes.js
│   └── userRoutes.js
├── sockets/               # Socket.IO event handlers
│   └── socketEvents.js
└── client/                # React frontend
    ├── src/
    │   ├── components/    # React components
    │   │   ├── atoms/     # Base components
    │   │   ├── molecules/ # Composite components
    │   │   └── Room/      # Video chat components
    │   ├── services/      # Socket.IO client
    │   ├── types/         # TypeScript definitions
    │   └── hooks/         # Custom React hooks
    └── public/
```

### Key Components

- **Room.tsx**: Main video chat interface with WebRTC implementation
- **VideoGrid.tsx**: Dynamic layout system for 1-6 participants
- **PeerConnectionManager.ts**: Manages multiple RTCPeerConnection instances
- **socketEvents.js**: WebRTC signaling server and room management
- **useMediaStream.ts**: Custom hook for camera/microphone control

## 🔧 Configuration

### Auth0 Setup (Optional)

1. Create Auth0 account at [auth0.com](https://auth0.com)
2. Create a new application (Single Page Application)
3. Configure callback URLs:
   - **Allowed Callback URLs**: `http://localhost:3000`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`
4. Update `.env` with your Auth0 credentials

### MongoDB Configuration

The application expects MongoDB to be running on the default port (27017). You can customize this by updating the `MONGODB_URI` environment variable.

## 🚢 Deployment

The application is configured for deployment on Render.com with the following build settings:

**Backend:**
- Build Command: `npm install`
- Start Command: `npm start`

**Frontend:**
- Build Command: `cd client && npm install && npm run build`
- The build uses `CI=false` flag to treat warnings as warnings, not errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Related Documentation

- [WebRTC Documentation](https://webrtc.org/getting-started/)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)

---

**Built with ❤️ using WebRTC, React, and Node.js**