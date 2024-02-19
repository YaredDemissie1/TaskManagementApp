const { createActivity } = require('../controllers/activity.controller');

let io;

const setupSocket = (socketIo) => {
  io = socketIo;

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join room based on user ID
    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Join project room
    socket.on('joinProject', (projectId) => {
      socket.join(`project_${projectId}`);
      console.log(`Socket ${socket.id} joined project ${projectId}`);
    });

    // Leave project room
    socket.on('leaveProject', (projectId) => {
      socket.leave(`project_${projectId}`);
      console.log(`Socket ${socket.id} left project ${projectId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

const emitToProject = (projectId, event, data) => {
  if (io) {
    io.to(`project_${projectId}`).emit(event, data);
  }
};

const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user_${userId}`).emit(event, data);
  }
};

module.exports = {
  setupSocket,
  emitToProject,
  emitToUser
}; 