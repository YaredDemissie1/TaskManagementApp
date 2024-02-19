import axios from '@/services/axios'

export default {
  namespaced: true,

  state: {
    tasks: [],
    loading: false,
    error: null
  },

  mutations: {
    SET_TASKS(state, tasks) {
      state.tasks = tasks
    },
    ADD_TASK(state, task) {
      state.tasks.push(task)
    },
    UPDATE_TASK(state, updatedTask) {
      const index = state.tasks.findIndex(task => task.id === updatedTask.id)
      if (index !== -1) {
        state.tasks.splice(index, 1, updatedTask)
      }
    },
    DELETE_TASK(state, taskId) {
      state.tasks = state.tasks.filter(task => task.id !== taskId)
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },

  actions: {
    async fetchTasks({ commit }) {
      commit('SET_LOADING', true)
      try {
        const { data } = await axios.get('/tasks')
        commit('SET_TASKS', data)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createTask({ commit }, taskData) {
      try {
        const { data } = await axios.post('/tasks', taskData)
        commit('ADD_TASK', data)
        return data
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      }
    },

    async updateTask({ commit }, { id, updates }) {
      try {
        const { data } = await axios.put(`/tasks/${id}`, updates)
        commit('UPDATE_TASK', data)
        return data
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      }
    },

    async deleteTask({ commit }, taskId) {
      try {
        await axios.delete(`/tasks/${taskId}`)
        commit('DELETE_TASK', taskId)
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      }
    }
  },

  getters: {
    getTaskById: (state) => (id) => {
      return state.tasks.find(task => task.id === id)
    }
  }
} 