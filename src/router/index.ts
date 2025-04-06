import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignInView from '@/views/SignInView.vue'
import { useAuthStore } from '@/stores/auth'
import UsersView from '@/views/UsersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignInView,
      meta: { requiresAuth: false },
      // Saving for later
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/settings/users',
      name: 'users',
      meta: { requiresAuth: true },
      component: UsersView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.accessToken) {
    authStore.checkInitialAuth()
  }

  const requiresAuth = to.meta.requiresAuth
  const isAuthenticated = authStore.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'signin' })
  } else if (to.name === 'signin' && isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
