<template>
  <div class="min-h-screen bg-gray-100">
    <nav v-if="isAuthenticated" class="bg-white shadow">
      <!-- Navigation content -->
    </nav>
    <router-view></router-view>
    <Notifications />
  </div>
</template>

<script>
import Notifications from '@/components/Notifications.vue'

export default {
  name: 'App',
  components: {
    Notifications
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.auth.isAuthenticated
    }
  }
}
</script> 