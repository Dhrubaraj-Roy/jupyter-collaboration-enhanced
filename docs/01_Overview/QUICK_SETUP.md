# Quick Setup Guide for Founder Review

## Prerequisites
- Python 3.13+ installed
- Node.js 18+ installed
- Git installed

## 1. Clone and Setup (if needed)
```bash
# If not already cloned
git clone <repository-url>
cd jupyter-collaboration
```

## 2. Install Dependencies
```bash
# Install Python dependencies
pip install -e projects/jupyter-server-ydoc
pip install -e projects/jupyter-collaboration
pip install -e projects/jupyter-collaboration-ui
pip install -e projects/jupyter-docprovider

# Install Node.js dependencies
npm install
```

## 3. Build the Frontend
```bash
# Build TypeScript packages
npm run build
```

## 4. Start the Server
```bash
# Start Jupyter Lab with collaboration
python -m jupyter lab --port=8888 --config=jupyter_server_config.py
```

## 5. Access the Application
- Open browser: `http://localhost:8888`
- The collaboration features will be available in the left sidebar

## 6. Demo with Multiple Users
1. Open the same URL in multiple browser windows/tabs
2. Create a new notebook
3. Click the collaboration icon (users icon) in the left sidebar
4. Click "Share" to get a shareable link
5. Open the link in another browser to see real-time collaboration

## Key Files to Review

### Frontend (TypeScript)
- `packages/collaboration-extension/src/collaboration.ts` - Main collaboration logic
- `packages/collaboration/src/collaboratorspanel.tsx` - UI components
- `packages/docprovider/src/yprovider.ts` - Document synchronization

### Backend (Python)
- `projects/jupyter-server-ydoc/jupyter_server_ydoc/websocketserver.py` - WebSocket server
- `projects/jupyter-server-ydoc/jupyter_server_ydoc/handlers.py` - HTTP handlers

## Troubleshooting

### SSL Warnings
- These are normal in development environment
- Can be ignored for demo purposes

### Port Already in Use
- Change the port: `--port=8889`
- Or kill existing processes: `pkill -f jupyter`

### Build Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Rebuild: `npm run build`

## What to Look For

### Code Quality
- Clean TypeScript/React components
- Proper error handling
- Type safety throughout

### Architecture
- Modular design with separate packages
- Clear separation of concerns
- Scalable WebSocket implementation

### Features
- Real-time cursor tracking
- Multi-user editing
- Document sharing
- User management

## Performance Notes
- Y.js handles operational transformation efficiently
- WebSocket connections are lightweight
- Supports multiple concurrent users 