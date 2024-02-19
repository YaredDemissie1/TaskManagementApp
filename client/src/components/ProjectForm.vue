<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">Project Name</label>
      <input 
        v-model="formData.name"
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

    <div v-if="!project">
      <label class="block text-sm font-medium text-gray-700">Team Members</label>
      <div class="mt-1 space-y-4">
        <UserSearch 
          :selectedUsers="selectedMembers"
          @select="addMember"
        />
        <div class="space-y-2">
          <div v-for="member in selectedMembers" 
               :key="member.id"
               class="flex items-center justify-between p-2 bg-gray-50 rounded-md"
          >
            <div>
              <div class="font-medium">{{ member.username }}</div>
              <div class="text-sm text-gray-500">{{ member.email }}</div>
            </div>
            <button 
              @click="removeMember(member)"
              class="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        </div>
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
        {{ loading ? 'Saving...' : (project ? 'Update' : 'Create') }}
      </button>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import UserSearch from './UserSearch.vue'

export default {
  name: 'ProjectForm',
  
  components: {
    UserSearch
  },

  props: {
    project: {
      type: Object,
      default: null
    }
  },

  setup(props) {
    const store = useStore()
    const loading = ref(false)
    const selectedMembers = ref([])
    const showMemberSearch = ref(false)

    const formData = ref({
      name: props.project?.name || '',
      description: props.project?.description || '',
      members: props.project?.members || []
    })

    const handleSubmit = async () => {
      loading.value = true
      try {
        const data = {
          ...formData.value,
          member_ids: selectedMembers.value.map(m => m.id)
        }

        if (props.project) {
          await store.dispatch('projects/updateProject', {
            id: props.project.id,
            updates: data
          })
        } else {
          await store.dispatch('projects/createProject', data)
        }
        loading.value = false
        formData.value = {
          name: '',
          description: '',
          members: []
        }
        selectedMembers.value = []
      } catch (error) {
        console.error('Project form error:', error)
      } finally {
        loading.value = false
      }
    }

    const removeMember = (member) => {
      selectedMembers.value = selectedMembers.value.filter(m => m.id !== member.id)
    }

    const addMember = (user) => {
      if (!selectedMembers.value.some(m => m.id === user.id)) {
        selectedMembers.value.push(user)
      }
    }

    return {
      formData,
      loading,
      selectedMembers,
      showMemberSearch,
      handleSubmit,
      removeMember,
      addMember
    }
  }
}
</script> 