<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import PrimaryButton from '@/components/PrimaryButton.vue'

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

      <PrimaryButton
        class="submit-btn"
        :is-loading="isLoading"
        default-text="Sign In"
        loading-text="Signing In..."
        type="submit"
      ></PrimaryButton>
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

.input {
  height: 3rem;
  padding-left: 12px;
  padding-right: 12px;
  font-size: 1.2rem;
  border: none;
  background-color: var(--input-background);
  border-radius: 8px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.input:hover {
  border-radius: 0px;
}

.input:focus {
  border-radius: 0px;
  box-shadow: 0 0 0 2px var(--focus-ring-color);
  outline: none;
}
</style>
