<template>
  <div class="space-y-4">
    <div v-if="loading" class="text-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
    </div>
    
    <div v-else-if="tasks.length === 0" class="text-center py-4 text-gray-500">
      No tasks found
    </div>
    
    <div v-else class="space-y-2">
      <div v-for="task in tasks" :key="task.id" 
           class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <h3 class="font-medium">{{ task.title }}</h3>
          <span :class="getStatusClass(task.status)" class="px-2 py-1 rounded-full text-xs">
            {{ task.status }}
          </span>
        </div>
        
        <p class="text-sm text-gray-600 mt-2">{{ task.description }}</p>
        
        <div class="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div class="flex items-center space-x-4">
            <span :class="getPriorityClass(task.priority)">
              {{ task.priority }}
            </span>
            <span>Due: {{ formatDate(task.due_date) }}</span>
          </div>
          
          <div class="flex space-x-2">
            <button @click="editTask(task)" 
                    class="text-blue-600 hover:text-blue-800">
              Edit
            </button>
            <button @click="deleteTask(task.id)" 
                    class="text-red-600 hover:text-red-800">
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
  name: 'TaskList',
  
  computed: {
    ...mapState('tasks', ['tasks', 'loading'])
  },
  
  methods: {
    ...mapActions('tasks', ['deleteTask']),
    
    formatDate(date) {
      if (!date) return 'No due date'
      return new Date(date).toLocaleDateString()
    },
    
    getStatusClass(status) {
      const classes = {
        pending: 'bg-yellow-100 text-yellow-800',
        'in-progress': 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },
    
    getPriorityClass(priority) {
      const classes = {
        high: 'text-red-600',
        medium: 'text-yellow-600',
        low: 'text-green-600'
      }
      return classes[priority] || 'text-gray-600'
    },
    
    editTask(task) {
      this.$emit('edit', task)
    }
  }
}
</script> 