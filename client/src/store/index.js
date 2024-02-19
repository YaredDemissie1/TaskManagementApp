import { createStore } from 'vuex'
import auth from './modules/auth'
import tasks from './modules/tasks'
import projects from './modules/projects'
import activities from './modules/activities'

export default createStore({
  modules: {
    auth,
    tasks,
    projects,
    activities
  }
}) 