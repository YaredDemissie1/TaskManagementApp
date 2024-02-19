<template>
  <div class="space-y-4">
    <div v-if="loading" class="text-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
    </div>
    
    <div v-else-if="projects.length === 0" class="text-center py-4 text-gray-500">
      No projects found
    </div>
    
    <div v-else class="space-y-2">
      <div v-for="project in projects" :key="project.id" 
           class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <h3 class="font-medium">{{ project.name }}</h3>
          <span class="text-sm text-gray-500">
            {{ project.member_ids?.length || 1 }} members
          </span>
        </div>
        
        <p class="text-sm text-gray-600 mt-2">{{ project.description }}</p>
        
        <div class="mt-4 flex justify-between items-center">
          <div class="text-sm text-gray-500">
            Created: {{ formatDate(project.created_at) }}
          </div>
          
          <div class="flex space-x-2">
            <button @click="editProject(project)" 
                    class="text-blue-600 hover:text-blue-800 text-sm">
              Edit
            </button>
            <button @click="deleteProject(project.id)" 
                    class="text-red-600 hover:text-red-800 text-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ProjectList',
  
  computed: {
    ...mapState('projects', ['projects', 'loading'])
  },
  
  methods: {
    ...mapActions('projects', ['deleteProject']),
    
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
    
    editProject(project) {
      this.$emit('edit', project)
    }
  }
}
</script> 