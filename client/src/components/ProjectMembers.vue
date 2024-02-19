<template>
  <div class="space-y-6">
    <!-- Add New Members Section -->
    <div>
      <h3 class="text-sm font-medium text-gray-700 mb-2">Add Team Members</h3>
      <UserSearch 
        :selectedUsers="members"
        @select="addMember"
      />
    </div>

    <!-- Current Members List -->
    <div>
      <h3 class="text-sm font-medium text-gray-700 mb-2">Current Members</h3>
      <div class="space-y-3">
        <div v-for="member in members" 
             :key="member.id"
             class="flex items-center justify-between p-3 bg-gray-50 rounded-md"
        >
          <div>
            <div class="font-medium">{{ member.username }}</div>
            <div class="text-sm text-gray-500">{{ member.email }}</div>
          </div>
          
          <div class="flex items-center space-x-3">
            <select
              v-if="canManageRoles && member.id !== currentUserId"
              v-model="member.role"
              @change="updateMemberRole(member)"
              class="text-sm rounded-md border-gray-300"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <span v-else class="text-sm text-gray-600">
              {{ member.role }}
            </span>

            <button
              v-if="canManageRoles && member.id !== currentUserId"
              @click="removeMember(member)"
              class="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import UserSearch from './UserSearch.vue'
import axios from '@/services/axios'

export default {
  name: 'ProjectMembers',

  components: {
    UserSearch
  },

  props: {
    projectId: {
      type: [String, Number],
      required: true
    },
    initialMembers: {
      type: Array,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const store = useStore()
    const members = ref([...props.initialMembers])
    
    const currentUserId = computed(() => store.state.auth.user?.id)
    const canManageRoles = computed(() => {
      const currentMember = members.value.find(m => m.id === currentUserId.value)
      return currentMember?.role === 'admin'
    })

    const addMember = async (user) => {
      try {
        const { data } = await axios.post(`/projects/${props.projectId}/members`, {
          userId: user.id,
          role: 'member'
        })
        members.value.push({ ...user, role: 'member' })
        store.dispatch('notifications/showSuccess', 'Member added successfully')
        emit('update')
      } catch (error) {
        store.dispatch('notifications/showError', 'Failed to add member')
      }
    }

    const updateMemberRole = async (member) => {
      try {
        await axios.put(`/projects/${props.projectId}/members/${member.id}`, {
          role: member.role
        })
        store.dispatch('notifications/showSuccess', 'Member role updated')
        emit('update')
      } catch (error) {
        store.dispatch('notifications/showError', 'Failed to update member role')
      }
    }

    const removeMember = async (member) => {
      if (!confirm(`Are you sure you want to remove ${member.username} from the project?`)) {
        return
      }

      try {
        await axios.delete(`/projects/${props.projectId}/members/${member.id}`)
        members.value = members.value.filter(m => m.id !== member.id)
        store.dispatch('notifications/showSuccess', 'Member removed successfully')
        emit('update')
      } catch (error) {
        store.dispatch('notifications/showError', 'Failed to remove member')
      }
    }

    return {
      members,
      currentUserId,
      canManageRoles,
      addMember,
      updateMemberRole,
      removeMember
    }
  }
}
</script> 