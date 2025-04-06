import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as authService from '@/services/authService'

const initialToken = sessionStorage.getItem('access_token')

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(initialToken)
  // TODO: fazer salvar usuario

  const isAuthenticated = computed(() => !!accessToken.value)

  async function handleSignIn(credentials: { username: string; password: string }) {
    try {
      const response = await authService.signin(credentials)
      accessToken.value = response.access_token
      sessionStorage.setItem('access_token', response.access_token)
    } catch (err) {
      console.error(err)
      // TODO: fazer um tratamento de erro melhor aqui, o authservice que faz o throw
      throw new Error('falha autenticando validar credenciai')
    }
  }

  // TODO: invalidar o token no banco
  async function handleSignOut() {
    sessionStorage.removeItem('access_token')
  }

  function checkInitialAuth() {
    const token = sessionStorage.getItem('access_token')
    if (token) {
      // TODO: talvez validar se o token ta ok? pegar infos do user
      accessToken.value = token
    } else {
      accessToken.value = null
    }
  }

  return { accessToken, isAuthenticated, handleSignIn, handleSignOut, checkInitialAuth }
})
