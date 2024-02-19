<template>
  <div class="relative">
    <input
      type="text"
      v-model="searchQuery"
      @input="handleSearch"
      placeholder="Search users..."
      class="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
    >
    
    <div v-if="loading" class="absolute right-3 top-2">
      <div class="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
    </div>

    <div v-if="showResults && searchResults.length > 0" 
         class="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
      <ul class="py-1">
        <li v-for="user in searchResults" 
            :key="user.id"
            @click="selectUser(user)"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
        >
          <div>
            <div class="font-medium">{{ user.username }}</div>
            <div class="text-sm text-gray-500">{{ user.email }}</div>
          </div>
          <button 
            v-if="!isSelected(user)"
            class="text-blue-600 hover:text-blue-800"
          >
            Add
          </button>
          <span v-else class="text-green-600">
            Added
          </span>
        </li>
      </ul>
    </div>

    <div v-else-if="showResults && searchQuery" 
         class="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg p-4 text-center text-gray-500">
      No users found
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import axios from '@/services/axios'
import { debounce } from 'lodash'

export default {
  name: 'UserSearch',

  props: {
    selectedUsers: {
      type: Array,
      default: () => []
    }
  },

  emits: ['select'],

  setup(props, { emit }) {
    const searchQuery = ref('')
    const searchResults = ref([])
    const loading = ref(false)
    const showResults = ref(false)

    const handleSearch = debounce(async () => {
      if (!searchQuery.value) {
        searchResults.value = []
        showResults.value = false
        return
      }

      loading.value = true
      try {
        const { data } = await axios.get(`/users/search?query=${searchQuery.value}`)
        searchResults.value = data
        showResults.value = true
      } catch (error) {
        console.error('User search error:', error)
      } finally {
        loading.value = false
      }
    }, 300)

    const selectUser = (user) => {
      if (!isSelected(user)) {
        emit('select', user)
        showResults.value = false
        searchQuery.value = ''
      }
    }

    const isSelected = (user) => {
      return props.selectedUsers.some(u => u.id === user.id)
    }

    watch(searchQuery, () => {
      if (searchQuery.value) {
        handleSearch()
      } else {
        showResults.value = false
      }
    })

    return {
      searchQuery,
      searchResults,
      loading,
      showResults,
      handleSearch,
      selectUser,
      isSelected
    }
  }
}
</script> 