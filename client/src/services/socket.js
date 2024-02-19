import { io } from 'socket.io-client';
import store from '@/store';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    this.socket = io(process.env.VUE_APP_WS_URL, {
      auth: { token }
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
      const userId = store.state.auth.user?.id;
      if (userId) {
        this.socket.emit('join', userId);
      }
    });

    this.socket.on('taskUpdated', (task) => {
      store.commit('tasks/UPDATE_TASK', task);
    });

    this.socket.on('taskCreated', (task) => {
      store.commit('tasks/ADD_TASK', task);
    });

    this.socket.on('taskDeleted', (taskId) => {
      store.commit('tasks/DELETE_TASK', taskId);
    });

    this.socket.on('projectUpdated', (project) => {
      store.commit('projects/UPDATE_PROJECT', project);
    });

    this.socket.on('newActivity', (activity) => {
      store.dispatch('activities/receiveActivity', activity);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });
  }

  joinProject(projectId) {
    if (this.socket) {
      this.socket.emit('joinProject', projectId);
    }
  }

  leaveProject(projectId) {
    if (this.socket) {
      this.socket.emit('leaveProject', projectId);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService(); 