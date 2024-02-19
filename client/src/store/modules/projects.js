import axios from '@/services/axios'

export default {
  namespaced: true,

  state: {
    projects: [],
    loading: false,
    error: null
  },

  mutations: {
    SET_PROJECTS(state, projects) {
      state.projects = projects
    },
    ADD_PROJECT(state, project) {
      state.projects.push(project)
    },
    UPDATE_PROJECT(state, updatedProject) {
      const index = state.projects.findIndex(project => project.id === updatedProject.id)
      if (index !== -1) {
        state.projects.splice(index, 1, updatedProject)
      }
    },
    DELETE_PROJECT(state, projectId) {
      state.projects = state.projects.filter(project => project.id !== projectId)
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },

  actions: {
    async fetchProjects({ commit }) {
      commit('SET_LOADING', true)
      try {
        const { data } = await axios.get('/projects')
        commit('SET_PROJECTS', data)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createProject({ commit }, projectData) {
      try {
        const { data } = await axios.post('/projects', projectData)
        commit('ADD_PROJECT', data)
        return data
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      }
    },

    async updateProject({ commit }, { id, updates }) {
      try {
        const { data } = await axios.put(`/projects/${id}`, updates)
        commit('UPDATE_PROJECT', data)
        return data
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      }
    },

    async deleteProject({ commit }, projectId) {
      try {
        await axios.delete(`/projects/${projectId}`)
        commit('DELETE_PROJECT', projectId)
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      }
    }
  },

  getters: {
    getProjectById: (state) => (id) => {
      return state.projects.find(project => project.id === id)
    }
  }
} 