# Jupyter Collaborative Teaching Environment

A real-time collaborative Jupyter environment designed for educational scenarios where teachers can monitor student work in read-only mode while students collaborate on assignments.

## 🎯 Project Overview

This project implements the features requested by your founder:

- **Custom Identity Provider**: Reads usernames from URL parameters
- **Read-only Mode**: Teachers can observe without editing
- **Real-time Collaboration**: Students see each other's cursors and changes
- **Easy Setup**: Simple configuration and startup scripts

## 🚀 Features

### ✅ Implemented Features

1. **URL-based User Identity**
   - Username extracted from `?username=Teacher` parameter
   - Automatic user identification without complex authentication

2. **Read-only Mode Support**
   - `?readonly=true` parameter enables read-only mode
   - Visual indicators for read-only sessions
   - Complete editing prevention for teachers

3. **Real-time Collaboration**
   - Live document synchronization
   - User awareness (cursors, selections)
   - Multiple users can edit simultaneously

4. **Educational UI**
   - Clear visual indicators for user roles
   - Read-only badges and styling
   - User information display

### 🎨 Visual Features

- **Read-only Indicator**: Red banner showing "READ-ONLY MODE (username)"
- **Document Styling**: Different background colors for read-only documents
- **User Cursors**: See other users' cursors and selections in real-time
- **Toolbar Disabling**: Read-only users see disabled toolbars

## 🛠️ Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- Git

### Installation

1. **Clone and Setup Environment**
   ```bash
   # The environment is already set up in the current directory
   source jupyter-collab-env/bin/activate
   ```

2. **Verify Installation**
   ```bash
   # Check that extensions are installed
   jupyter labextension list | grep collaboration
   ```

## 🎓 Usage

### Starting the Server

```bash
# Make sure you're in the projectX directory
./start_collaboration_server.sh
```

### Access URLs

**For Teachers (Read-only)**:
```
http://localhost:8888/lab?username=Teacher&readonly=true
```

**For Students (Full Access)**:
```
http://localhost:8888/lab?username=Student1&readonly=false
http://localhost:8888/lab?username=Student2&readonly=false
```

### Demo Scenarios

1. **Open Multiple Browser Tabs**
   - Tab 1: Teacher URL (read-only)
   - Tab 2: Student1 URL (editable)
   - Tab 3: Student2 URL (editable)

2. **Load Demo Notebook**
   - Open `demo_notebook.ipynb` in all tabs
   - Watch real-time collaboration in action

3. **Test Features**
   - Students edit cells → Teacher sees changes immediately
   - Teacher tries to edit → Blocked with visual feedback
   - Multiple students edit → See each other's cursors

## 🏗️ Technical Architecture

### Components

1. **Custom Identity Provider** (`custom_identity_provider.py`)
   - Extracts username and readonly flag from URL
   - Integrates with Jupyter Server authentication

2. **Read-only Extension** (`readonly.ts`)
   - Monitors document widgets
   - Applies read-only restrictions
   - Adds visual indicators

3. **Modified Collaboration Extension**
   - Integrates read-only functionality
   - Maintains real-time features

### File Structure

```
projectX/
├── custom_identity_provider.py      # URL-based identity provider
├── jupyter_server_config.py         # Server configuration
├── start_collaboration_server.sh    # Startup script
├── demo_notebook.ipynb              # Demo content
├── jupyter-collaboration/           # Modified extension
│   └── packages/
│       └── collaboration-extension/
│           └── src/
│               ├── readonly.ts      # Read-only functionality
│               ├── collaboration.ts # Modified with read-only plugin
│               └── index.ts         # Plugin registration
└── jupyter-collab-env/             # Python environment
```

## 🔧 Configuration

### Server Configuration (`jupyter_server_config.py`)

```python
# Custom identity provider
c.ServerApp.identity_provider_class = 'custom_identity_provider.URLIdentityProvider'

# Collaboration settings
c.YDocExtension.disable_rtc = False
c.YDocExtension.file_poll_interval = 1.0
c.YDocExtension.document_cleanup_delay = 60.0
```

### URL Parameters

| Parameter | Values | Description |
|-----------|--------|-------------|
| `username` | Any string | User display name |
| `readonly` | `true`/`false` | Enable read-only mode |

## 🎬 Demo Walkthrough

### Scenario 1: Teacher Monitoring Students

1. **Teacher opens**: `?username=Teacher&readonly=true`
   - Sees red "READ-ONLY MODE" banner
   - Cannot edit any content
   - Observes all student activity

2. **Students open**: `?username=Student1&readonly=false`
   - Can edit and run code
   - See teacher's cursor (if teacher navigates)
   - Collaborate in real-time

### Scenario 2: Collaborative Problem Solving

1. **Multiple students** work on the same notebook
2. **Real-time features**:
   - See each other typing
   - Cursor positions visible
   - Instant synchronization
3. **Teacher oversight**:
   - Monitor progress without interference
   - Provide guidance through other channels

## 🐛 Troubleshooting

### Common Issues

1. **Extension not loading**
   ```bash
   # Rebuild the extension
   cd jupyter-collaboration
   python scripts/dev_install.py
   ```

2. **Identity provider not working**
   ```bash
   # Check Python path includes current directory
   export PYTHONPATH=$PWD:$PYTHONPATH
   ```

3. **Read-only mode not activating**
   - Ensure URL includes `?readonly=true`
   - Check browser console for JavaScript errors

### Debug Mode

Add debug logging to `jupyter_server_config.py`:
```python
c.Application.log_level = 'DEBUG'
```

## 🔮 Future Enhancements

Based on your founder's vision, potential improvements:

1. **Enhanced Permissions**
   - Granular read-only controls (specific cells)
   - Time-limited editing permissions

2. **Advanced Teaching Features**
   - Student progress tracking
   - Assignment submission workflow
   - Code review and commenting

3. **Scalability**
   - Database-backed user management
   - Room-based access control
   - Integration with LMS systems

## 📝 Development Notes

### Key Implementation Decisions

1. **URL-based Authentication**: Simple but effective for demos
2. **Client-side Read-only**: Fast response, visual feedback
3. **Periodic Monitoring**: Reliable document detection
4. **Visual Indicators**: Clear user experience

### Extension Points

The architecture allows for easy extension:
- Additional URL parameters
- Custom user roles
- Integration with external auth systems
- Advanced collaboration features

## 🎉 Success Metrics

This implementation achieves the founder's goals:

- ✅ **Real-time collaboration** working
- ✅ **URL-based user identification** implemented
- ✅ **Read-only mode** for teachers functional
- ✅ **Easy deployment** with simple scripts
- ✅ **Educational focus** with appropriate UI/UX

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console logs
3. Verify server configuration
4. Test with demo notebook

The project demonstrates a solid foundation for collaborative educational environments and can be extended based on specific institutional needs. 