export default {
  namespaced: true,

  state: {
    notifications: []
  },

  mutations: {
    ADD_NOTIFICATION(state, notification) {
      state.notifications.push({
        id: Date.now(),
        ...notification
      })
    },
    REMOVE_NOTIFICATION(state, id) {
      state.notifications = state.notifications.filter(n => n.id !== id)
    }
  },

  actions: {
    showNotification({ commit }, { type, message, timeout = 5000 }) {
      const notification = {
        type,
        message
      }
      commit('ADD_NOTIFICATION', notification)
      setTimeout(() => {
        commit('REMOVE_NOTIFICATION', notification.id)
      }, timeout)
    },

    showError({ dispatch }, message) {
      dispatch('showNotification', {
        type: 'error',
        message
      })
    },

    showSuccess({ dispatch }, message) {
      dispatch('showNotification', {
        type: 'success',
        message
      })
    }
  }
} 