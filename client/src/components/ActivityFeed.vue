<template>
  <div class="space-y-4">
    <div v-if="loading" class="text-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
    </div>
    
    <div v-else-if="activities.length === 0" class="text-center py-4 text-gray-500">
      No recent activity
    </div>
    
    <div v-else class="space-y-2">
      <div v-for="activity in activities" :key="activity.id"
           class="flex items-start space-x-3 p-3 bg-white rounded-lg shadow">
        <div class="flex-shrink-0">
          <div :class="getActivityIconClass(activity.type)" 
               class="w-8 h-8 rounded-full flex items-center justify-center">
            <i :class="getActivityIcon(activity.type)"></i>
          </div>
        </div>
        
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-900">
            {{ formatActivityMessage(activity) }}
          </p>
          <p class="text-xs text-gray-500">
            {{ formatDate(activity.created_at) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityFeed',
  
  props: {
    activities: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString()
    },
    
    getActivityIconClass(type) {
      const classes = {
        task_created: 'bg-green-100 text-green-600',
        task_updated: 'bg-blue-100 text-blue-600',
        task_deleted: 'bg-red-100 text-red-600',
        project_created: 'bg-purple-100 text-purple-600',
        project_updated: 'bg-yellow-100 text-yellow-600'
      }
      return classes[type] || 'bg-gray-100 text-gray-600'
    },
    
    getActivityIcon(type) {
      const icons = {
        task_created: 'fas fa-plus',
        task_updated: 'fas fa-edit',
        task_deleted: 'fas fa-trash',
        project_created: 'fas fa-folder-plus',
        project_updated: 'fas fa-folder'
      }
      return icons[type] || 'fas fa-circle'
    },
    
    formatActivityMessage(activity) {
      // Customize based on your activity structure
      return `${activity.user_name} ${activity.action} ${activity.target_type} "${activity.target_name}"`
    }
  }
}
</script> 