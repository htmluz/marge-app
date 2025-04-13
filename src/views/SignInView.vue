<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')

const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

async function submitSignIn() {
  isLoading.value = true
  errorMessage.value = null

  try {
    await authStore.handleSignIn({
      username: username.value,
      password: password.value,
    })
    router.push('/')
  } catch (err: unknown) {
    if (err instanceof Error) {
      errorMessage.value = err.message
    } else {
      errorMessage.value = 'Ocorreu um erro durante o login'
    }
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <h2 class="login-title">Welcome Back to Marge</h2>
    <form @submit.prevent="submitSignIn" class="login-form">
      <div class="form-group">
        <input
          type="text"
          id="username"
          v-model="username"
          required
          class="primary-input"
          :disabled="isLoading"
          autocomplete="username"
          placeholder="Username"
        />
      </div>
      <div class="form-group">
        <input
          type="password"
          id="password"
          v-model="password"
          required
          class="primary-input"
          :disabled="isLoading"
          autocomplete="current-password"
          placeholder="Password"
        />
      </div>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <button type="submit" class="primary-button p-button" :disabled="isLoading">
        {{ isLoading ? 'Signing In...' : 'Sign In' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.submit-btn {
  height: 3rem;
  font-size: 1.2rem;
}

.login-container {
  position: absolute;
  top: 49%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 600px;
  padding: 25px;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.login-title {
  text-align: left;
  cursor: default;
}

.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 4px;
}

.p-button {
  height: 3rem;
  font-size: 1.2rem;
}
</style>
