import axios from '@/services/axios'

export default {
  namespaced: true,

  state: {
    activities: [],
    loading: false,
    error: null
  },

  mutations: {
    SET_ACTIVITIES(state, activities) {
      state.activities = activities
    },
    ADD_ACTIVITY(state, activity) {
      state.activities.unshift(activity)
      if (state.activities.length > 50) {
        state.activities.pop()
      }
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },

  actions: {
    async fetchActivities({ commit }) {
      commit('SET_LOADING', true)
      try {
        const { data } = await axios.get('/activities')
        commit('SET_ACTIVITIES', data)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // This action will be called by Socket.io when new activities are received
    receiveActivity({ commit }, activity) {
      commit('ADD_ACTIVITY', activity)
    }
  },

  getters: {
    recentActivities: state => state.activities.slice(0, 10)
  }
} 