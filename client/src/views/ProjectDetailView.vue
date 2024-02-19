<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center">
      <div class="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
    </div>

    <template v-else-if="project">
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ project.name }}</h1>
            <p class="text-gray-600 mt-2">{{ project.description }}</p>
          </div>
          <div v-if="isProjectAdmin" class="flex space-x-2">
            <button
              @click="showEditModal = true"
              class="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
            >
              Edit Project
            </button>
            <button
              @click="confirmDelete"
              class="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50"
            >
              Delete Project
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Tasks Section -->
          <div class="col-span-2">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold">Tasks</h2>
              <button
                @click="showNewTaskModal = true"
                class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                New Task
              </button>
            </div>
            <TaskList 
              :tasks="projectTasks"
              @edit="editTask"
            />
          </div>

          <!-- Team Members Section -->
          <div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold">Team Members</h2>
                <button
                  v-if="isProjectAdmin"
                  @click="showMemberModal = true"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Manage
                </button>
              </div>
              <div class="space-y-3">
                <div
                  v-for="member in projectMembers"
                  :key="member.id"
                  class="flex items-center justify-between"
                >
                  <div>
                    <div class="font-medium">{{ member.username }}</div>
                    <div class="text-sm text-gray-500">{{ member.role }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Activity Feed -->
            <div class="mt-6">
              <h2 class="text-lg font-semibold mb-4">Recent Activity</h2>
              <ActivityFeed 
                :activities="projectActivities"
                :loading="activitiesLoading"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Modals -->
    <Modal
      v-if="showEditModal"
      title="Edit Project"
      @close="showEditModal = false"
    >
      <ProjectForm
        :project="project"
        @submit="updateProject"
        @cancel="showEditModal = false"
      />
    </Modal>

    <Modal
      v-if="showNewTaskModal"
      title="New Task"
      @close="showNewTaskModal = false"
    >
      <TaskForm
        :project-id="project?.id"
        @submit="createTask"
        @cancel="showNewTaskModal = false"
      />
    </Modal>

    <Modal
      v-if="showMemberModal"
      title="Manage Team Members"
      @close="showMemberModal = false"
    >
      <ProjectMembers
        :project-id="project?.id"
        :members="projectMembers"
        @update="fetchProjectMembers"
        @close="showMemberModal = false"
      />
    </Modal>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import Modal from '@/components/Modal.vue'
import TaskList from '@/components/TaskList.vue'
import TaskForm from '@/components/TaskForm.vue'
import ProjectForm from '@/components/ProjectForm.vue'
import ActivityFeed from '@/components/ActivityFeed.vue'
import ProjectMembers from '@/components/ProjectMembers.vue'

export default {
  name: 'ProjectDetailView',

  components: {
    Modal,
    TaskList,
    TaskForm,
    ProjectForm,
    ActivityFeed,
    ProjectMembers
  },

  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const loading = ref(true)
    const activitiesLoading = ref(true)
    const showEditModal = ref(false)
    const showNewTaskModal = ref(false)
    const showMemberModal = ref(false)

    const project = computed(() => 
      store.getters['projects/getProjectById'](route.params.id)
    )

    const projectTasks = computed(() => 
      store.state.tasks.tasks.filter(task => task.project_id === project.value?.id)
    )

    const projectMembers = ref([])
    const projectActivities = ref([])

    const isProjectAdmin = computed(() => {
      const member = projectMembers.value.find(m => m.id === store.state.auth.user?.id)
      return member?.role === 'admin'
    })

    const fetchProjectData = async () => {
      try {
        await Promise.all([
          store.dispatch('projects/fetchProjects'),
          store.dispatch('tasks/fetchTasks'),
          fetchProjectMembers(),
          fetchProjectActivities()
        ])
      } catch (error) {
        store.dispatch('notifications/showError', 'Failed to load project data')
      } finally {
        loading.value = false
      }
    }

    const fetchProjectMembers = async () => {
      try {
        const response = await axios.get(`/users/project/${route.params.id}/members`)
        projectMembers.value = response.data
      } catch (error) {
        store.dispatch('notifications/showError', 'Failed to load team members')
      }
    }

    const fetchProjectActivities = async () => {
      activitiesLoading.value = true
      try {
        const response = await axios.get(`/activities?projectId=${route.params.id}`)
        projectActivities.value = response.data
      } catch (error) {
        store.dispatch('notifications/showError', 'Failed to load activities')
      } finally {
        activitiesLoading.value = false
      }
    }

    onMounted(fetchProjectData)

    return {
      loading,
      activitiesLoading,
      project,
      projectTasks,
      projectMembers,
      projectActivities,
      isProjectAdmin,
      showEditModal,
      showNewTaskModal,
      showMemberModal
    }
  }
}
</script> 