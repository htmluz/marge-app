import { createRouter, createWebHistory } from 'vue-router'
import SignInView from '@/views/SignInView.vue'
import { useAuthStore } from '@/stores/auth'
import UsersView from '@/views/UsersView.vue'
import SipCallsView from '@/views/SipCallsView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProfileView from '@/views/ProfileView.vue'
import RolesView from '@/views/RolesView.vue'
import SipRegisterView from '@/views/SipRegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignInView,
      meta: { requiresAuth: false },
    },
    {
      path: '/settings/users',
      name: 'users',
      meta: { requiresAuth: true },
      component: UsersView,
    },
    {
      path: '/settings/roles',
      name: 'roles',
      meta: { requiresAuth: true },
      component: RolesView,
    },
    {
      path: '/settings/me',
      name: 'profile',
      meta: { requiresAuth: true },
      component: ProfileView,
    },
    {
      path: '/sip/calls',
      name: 'sip_calls',
      meta: { requiresAuth: true },
      component: SipCallsView,
    },
    {
      path: '/sip/registers',
      name: 'sip_registers',
      meta: { requiresAuth: true },
      component: SipRegisterView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'signin' },
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
