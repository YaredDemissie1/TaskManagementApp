import axios from '@/services/axios'
import socketService from '@/services/socket'

export default {
  namespaced: true,
  
  state: {
    token: localStorage.getItem('token') || null,
    user: null,
    isAuthenticated: false
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      state.isAuthenticated = !!token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    SET_USER(state, user) {
      state.user = user
    }
  },

  actions: {
    async login({ commit }, credentials) {
      try {
        const { data } = await axios.post('/auth/login', credentials)
        commit('SET_TOKEN', data.token)
        commit('SET_USER', data.user)
        socketService.connect(data.token)
        return data
      } catch (error) {
        throw error
      }
    },

    async logout({ commit }) {
      socketService.disconnect()
      commit('SET_TOKEN', null)
      commit('SET_USER', null)
    },

    async fetchUser({ commit }) {
      try {
        const { data } = await axios.get('/auth/me')
        commit('SET_USER', data)
        return data
      } catch (error) {
        throw error
      }
    }
  },

  getters: {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user
  }
} 