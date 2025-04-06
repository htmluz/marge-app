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
  } catch (err: any) {
    errorMessage.value = err.message || 'Ocorreu um erro durante o login'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <h2 class="login-title">Sign Into Marge</h2>
    <form @submit.prevent="submitSignIn" class="login-form">
      <div class="form-group">
        <!-- <label for="username" class="label">Username:</label> -->
        <input
          type="text"
          id="username"
          v-model="username"
          required
          class="input"
          :disabled="isLoading"
          autocomplete="username"
          placeholder="Username"
        />
      </div>
      <div class="form-group">
        <!-- <label for="password" class="label">Password:</label> -->
        <input
          type="password"
          id="password"
          v-model="password"
          required
          class="input"
          :disabled="isLoading"
          autocomplete="current-password"
          placeholder="Password"
        />
      </div>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <button type="submit" class="submit-button" :disabled="isLoading">
        {{ isLoading ? 'Signing In...' : 'Sign In' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--background-color);

  width: 420px;
  padding: 25px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
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

.input {
  height: 2.4rem;
  padding-left: 6px;
  padding-right: 6px;
  border: 1px solid var(--border-color);
  border-radius: 2px;
  box-sizing: border-box;
}

.submit-button {
  height: 2.4rem;
  border: 1px solid var(--border-color);
  background-color: var(--button-background-color);
  font-size: 1rem;
  border-radius: 2px;
  box-sizing: border-box;
  transition: all 0.15s ease;
}

.submit-button:disabled {
  background-color: var(--button-disabled-background-color);
}

.submit-button:not(:disabled):hover {
  background-color: var(--button-hover-background-color);
}

.submit-button:not(:disabled):active {
  background-color: var(--button-active-background-color);
  border: 1px solid var(--button-active-border-color);
}
</style>
