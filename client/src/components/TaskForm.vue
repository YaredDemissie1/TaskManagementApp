<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">Title</label>
      <input 
        v-model="formData.title"
        type="text"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Description</label>
      <textarea
        v-model="formData.description"
        rows="3"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      ></textarea>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Project</label>
        <select
          v-model="formData.project_id"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">No Project</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Assigned To</label>
        <select
          v-model="formData.assigned_to"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Unassigned</option>
          <option v-for="member in projectMembers" :key="member.id" :value="member.id">
            {{ member.username }}
          </option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Due Date</label>
        <input
          v-model="formData.due_date"
          type="date"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Priority</label>
        <select
          v-model="formData.priority"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>

    <div v-if="task" class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Status</label>
        <select
          v-model="formData.status"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>

    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        :disabled="loading"
      >
        {{ loading ? 'Saving...' : (task ? 'Update' : 'Create') }}
      </button>
    </div>
  </form>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'TaskForm',

  props: {
    task: {
      type: Object,
      default: null
    }
  },

  setup(props) {
    const store = useStore()
    const loading = ref(false)

    const formData = ref({
      title: props.task?.title || '',
      description: props.task?.description || '',
      project_id: props.task?.project_id || '',
      assigned_to: props.task?.assigned_to || '',
      due_date: props.task?.due_date || '',
      priority: props.task?.priority || 'medium',
      status: props.task?.status || 'pending'
    })

    const projects = computed(() => store.state.projects.projects)
    const projectMembers = computed(() => {
      if (!formData.value.project_id) return []
      const project = projects.value.find(p => p.id === formData.value.project_id)
      return project?.members || []
    })

    const handleSubmit = async () => {
      loading.value = true
      try {
        if (props.task) {
          await store.dispatch('tasks/updateTask', {
            id: props.task.id,
            updates: formData.value
          })
        } else {
          await store.dispatch('tasks/createTask', formData.value)
        }
        loading.value = false
        formData.value = {
          title: '',
          description: '',
          project_id: '',
          assigned_to: '',
          due_date: '',
          priority: 'medium',
          status: 'pending'
        }
      } catch (error) {
        console.error('Task form error:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      formData,
      loading,
      projects,
      projectMembers,
      handleSubmit
    }
  }
}
</script> 