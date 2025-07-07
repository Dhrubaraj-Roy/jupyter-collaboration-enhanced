# Testing the Collaborative Jupyter Environment

## Quick Start

1. **Start the server**:
   ```bash
   ./start_collaboration_server.sh
   ```

2. **Open multiple browser tabs**:
   - **Teacher**: `http://localhost:8888/lab?username=Teacher&readonly=true`
   - **Student1**: `http://localhost:8888/lab?username=Student1&readonly=false`
   - **Student2**: `http://localhost:8888/lab?username=Student2&readonly=false`

3. **Open the demo notebook** in all tabs:
   - Navigate to `demo_notebook.ipynb`

## Expected Behavior

### ✅ Read-only Mode (Teacher)
- Red "READ-ONLY MODE (Teacher)" banner appears
- Documents have red border and read-only styling
- Cannot edit any cells or text
- Toolbar buttons are disabled
- Can see all student activity in real-time

### ✅ Collaborative Mode (Students)
- Can edit all content freely
- See other users' cursors and selections
- Changes appear instantly in all tabs
- User names shown in collaboration panel

### ✅ Real-time Features
- Type in one tab → see changes in others immediately
- Cursor movements visible across sessions
- Cell execution results shared
- User awareness in sidebar

## Troubleshooting

If something doesn't work:

1. **Check the console** for JavaScript errors
2. **Verify URLs** include correct parameters
3. **Restart the server** if extensions don't load
4. **Clear browser cache** if styling issues occur

## What to Look For

- [ ] Red read-only banner for teacher
- [ ] Document borders change for read-only mode
- [ ] Teacher cannot type or edit anything
- [ ] Students can edit freely
- [ ] Changes sync across all tabs instantly
- [ ] Cursors visible from other users
- [ ] User names display correctly
- [ ] Collaboration panel shows all users

## Success Criteria

🎉 **Project is working if**:
1. Teacher sees read-only mode and cannot edit
2. Students can collaborate in real-time
3. All users see each other's activity
4. Username from URL parameter displays correctly
5. Visual indicators clearly show user roles 