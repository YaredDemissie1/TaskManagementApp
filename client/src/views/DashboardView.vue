<template>
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">My Tasks</h2>
        <task-list :tasks="myTasks" />
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">Projects</h2>
        <project-list :projects="projects" />
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">Team Activity</h2>
        <activity-feed :activities="activities" />
      </div>
    </div>
  </div>
</template>

<script>
import TaskList from '@/components/TaskList.vue'
import ProjectList from '@/components/ProjectList.vue'
import ActivityFeed from '@/components/ActivityFeed.vue'

export default {
  name: 'DashboardView',
  components: {
    TaskList,
    ProjectList,
    ActivityFeed
  },
  computed: {
    myTasks() {
      return this.$store.state.tasks.tasks
    },
    projects() {
      return this.$store.state.projects.projects
    },
    activities() {
      return this.$store.state.activities.recent
    }
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('tasks/fetchTasks'),
      this.$store.dispatch('projects/fetchProjects'),
      this.$store.dispatch('activities/fetchActivities')
    ])
  }
}
</script> 