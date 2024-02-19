<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" role="dialog">
      <div class="flex min-h-screen items-center justify-center px-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black opacity-30" @click="$emit('close')"></div>

        <!-- Modal -->
        <div class="relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all">
          <!-- Header -->
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              {{ title }}
            </h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-500"
            >
              <span class="sr-only">Close</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="mt-2">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  emits: ['close']
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style> 