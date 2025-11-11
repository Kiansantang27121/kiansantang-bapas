import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import db, { initDatabase } from './database.js';
import authRoutes from './routes/auth.js';
import servicesRoutes from './routes/services.js';
import queueRoutes from './routes/queue.js';
import countersRoutes from './routes/counters.js';
import settingsRoutes from './routes/settings.js';
import usersRoutes from './routes/users.js';
import dashboardRoutes from './routes/dashboard.js';
import uploadRoutes from './routes/upload.js';
import pkRoutes from './routes/pk.js';
import clientsRoutes from './routes/clients.js';
import googleSheetsRoutes from './routes/googleSheets.js';
import pkQueueRoutes from './routes/pk-queue.js';
import ratingRoutes from './routes/rating.js';
import penghadapanRoutes from './routes/penghadapan.js';
import kunjunganRoutes from './routes/kunjungan.js';
import pengaduanRoutes from './routes/pengaduan.js';
import workflowRoutes from './routes/workflow-sqlite.js';
import serviceProcessRoutes from './routes/service-process.js';
import pkAuthRoutes from './routes/pk-auth.js';
import roomsRoutes from './routes/rooms.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' })); // Increase limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Initialize database
await initDatabase();

// Make io accessible to routes
app.set('io', io);

// Static files for uploads with proper MIME types
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    if (path.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    } else if (path.endsWith('.webm')) {
      res.setHeader('Content-Type', 'video/webm');
    } else if (path.endsWith('.ogg')) {
      res.setHeader('Content-Type', 'video/ogg');
    }
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/counters', countersRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/pk', pkRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/google-sheets', googleSheetsRoutes);
app.use('/api/pk-queue', pkQueueRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/penghadapan', penghadapanRoutes);
app.use('/api/kunjungan', kunjunganRoutes);
app.use('/api/pengaduan', pengaduanRoutes);
app.use('/api/workflow', workflowRoutes);
app.use('/api/service', serviceProcessRoutes);
app.use('/api/pk-auth', pkAuthRoutes);
app.use('/api/rooms', roomsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'KIANSANTANG API is running',
    fullName: 'Kios Antrian Santun dan Tanggap',
    organization: 'BAPAS Kelas I Bandung',
    version: '1.0.0'
  });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

httpServer.listen(PORT, () => {
  console.log('\n========================================');
  console.log('  KIANSANTANG API Server');
  console.log('  Kios Antrian Santun dan Tanggap');
  console.log('  BAPAS Kelas I Bandung');
  console.log('========================================');
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🔌 Socket.IO: http://localhost:${PORT}`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health`);
  console.log('\n========================================\n');
});

export { io };
