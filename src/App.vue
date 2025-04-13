<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { useAuthStore } from './stores/auth'
import { computed, onMounted } from 'vue'
import AppLayout from './components/AppLayout.vue'

const { currentTheme, toggleTheme } = useTheme()
const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const handleSignOut = async () => {
  await authStore.handleSignOut()
  router.push('/signin')
}

onMounted(() => {
  authStore.checkInitialAuth()
})
</script>

<template>
  <div id="app-container" :class="currentTheme">
    <template v-if="isAuthenticated">
      <AppLayout
        :current-theme="currentTheme"
        @toggle-theme="toggleTheme"
        @sign-out="handleSignOut"
      >
        <RouterView v-slot="{ Component }">
          <template v-if="Component">
            <Transition name="fade" mode="out-in">
              <KeepAlive>
                <Suspense>
                  <component :is="Component"></component>
                  <template #fallback>Loading...</template>
                </Suspense>
              </KeepAlive>
            </Transition>
          </template>
        </RouterView>
      </AppLayout>
    </template>

    <template v-else>
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <Transition name="fade" mode="out-in">
            <Suspense>
              <component :is="Component"></component>
              <template #fallback>Loading...</template>
            </Suspense>
          </Transition>
        </template>
      </RouterView>
    </template>
  </div>
</template>

<style scoped>
#app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.app-header {
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.app-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.main-content {
  flex-grow: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
</style>
