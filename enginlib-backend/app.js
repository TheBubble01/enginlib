const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const materialRoutes = require('./routes/materialRoutes');
const aiRoutes = require('./routes/aiRoutes');
const quizRoutes = require('./routes/quizRoutes');
const hiveRoutes = require('./routes/hiveRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Initialize Express
const app = express();

// Implementiong realtime syncing
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*', // for now, allow all origins — tighten later
    methods: ['GET', 'POST']
  }
});

// Attach io to app so controllers can use it
app.set('io', io);

// Socket events
io.on('connection', (socket) => {
  console.log(`✅ A user connected: ${socket.id}`);

  // When a user joins a HiveGroup room
  socket.on('joinGroup', (groupId) => {
    socket.join(`group_${groupId}`);
    console.log(`User joined group room: group_${groupId}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ A user disconnected: ${socket.id}`);
  });
});

// For directory access
const fs = require('fs');
const path = require('path');

// Ensure the 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', passwordResetRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/materials', materialRoutes);

app.use('/api/ai', aiRoutes);
app.use('/api/quizzes', quizRoutes);

app.use('/api/hive', hiveRoutes);
app.use('/api/notifications', notificationRoutes);

// Test database connection
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.log('Error: ' + err));

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
