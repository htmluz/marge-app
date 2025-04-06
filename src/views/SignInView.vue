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
    <h2 class="login-title">Welcome Back to Marge</h2>
    <form @submit.prevent="submitSignIn" class="login-form">
      <div class="form-group">
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

.input {
  height: 3rem;
  padding-left: 12px;
  padding-right: 12px;
  font-size: 1.2rem;
  border: none;
  background-color: var(--input-background-color);
  border-radius: 8px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.input:focus {
  background-color: var(--input-focus-background-color);
  border-radius: 0px;
  box-shadow: 0 0 0 2px var(--focus-ring-color);
  outline: none;
}

.submit-button {
  cursor: pointer;
  height: 3rem;
  border: none;
  color: var(--button-text-color);
  background-color: var(--button-background-color);
  font-size: 1.2rem;
  border-radius: 8px;
  box-sizing: border-box;
  transition:
    border-radius 0.2s ease,
    outline 0.05s ease;
}

.submit-button:not(:disabled):hover {
  border-radius: 0px;
}

.submit-button:not(:disabled):focus {
  outline: 2px solid var(--button-background-color);
  outline-style: dashed;
  outline-offset: 4px;
}
</style>
