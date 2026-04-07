require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const initCronJobs = require('./services/cronJobs');

connectDB();

const app = express();
const server = http.createServer(app);

// Initialize automated scheduled tasks
initCronJobs();

const io = new Server(server, {
  cors: {
    origin: "*", // allow all logic for now
    methods: ["GET", "POST"]
  }
});
app.set('io', io); // Accessible in controllers via req.app.get('io')

io.on('connection', (socket) => {
    console.log('Socket client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Socket client disconnected:', socket.id);
    });
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/api', (req, res) => {
    res.send('Sunstone Academy Backend API is running');
});

const path = require('path');

const PORT = process.env.PORT || 5000;

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route to serve React app for internal routing
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  } else {
    next();
  }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
