<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

defineProps({
  currentTheme: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['toggle-theme', 'sign-out'])

const route = useRoute()

const toggleTheme = () => {
  emit('toggle-theme')
}

const handleSignOut = () => {
  emit('sign-out')
}

interface MenuItem {
  title: string
  path: string
  icon: string
  active: boolean
  expanded: boolean
  children: MenuOptions[]
}

interface MenuOptions {
  title: string
  path: string
  icon: string
  active: boolean
}

const menuItems = ref<MenuItem[]>([
  {
    title: 'Dashboard',
    path: '/',
    expanded: false,
    active: false,
    icon: '',
    children: [],
  },
  {
    title: 'SIP',
    path: '',
    expanded: false,
    active: false,
    icon: '',
    children: [
      { title: 'Calls', path: '/sip/calls', icon: '', active: false },
      { title: 'Register', path: '/sip/registers', icon: '', active: false },
    ],
  },
  {
    title: 'Settings',
    path: '',
    expanded: false,
    active: false,
    icon: '',
    children: [
      { title: 'Roles and Permissions', path: '/settings/roles', icon: '', active: false },
      { title: 'Profile', path: '/settings/me', icon: '', active: false },
      { title: 'Users', path: '/settings/users', icon: '', active: false },
    ],
  },
])

const toggleExpand = (item: MenuItem) => {
  item.expanded = !item.expanded
}

function updateActiveMenuItems(currentPath: string) {
  menuItems.value.forEach((item) => {
    item.active = false
    if (item.children && item.children.length) {
      item.children.forEach((child) => {
        child.active = false
      })

      const matchedChild = item.children.find((child) => child.path === currentPath)
      if (matchedChild) {
        matchedChild.active = true
        item.active = true
        item.expanded = true
      } else {
        if (item.path && item.path === currentPath) {
          item.active = true
        }
        item.expanded = false
      }
    } else {
      if (item.path === currentPath) {
        item.active = true
      }
    }
  })
}

watch(
  () => route.path,
  (newPath) => {
    updateActiveMenuItems(newPath)
  },
  { immediate: true },
)

// TODO: handlers for ctrl+k
onMounted(() => {})

onUnmounted(() => {
  updateActiveMenuItems(route.path)
})
</script>

<template>
  <div class="app-layout">
    <div class="topbar">
      <div class="topbar-content">
        <div class="title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="main-logo"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            />
          </svg>
          <span class="abz"> - </span>
          <span class="app-title">Marge</span>
        </div>
        <div class="search-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="search-icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            ref="searchInput"
            type="text"
            class="search-input"
            placeholder="Search or jump to"
          />
          <div class="shortcut-indicator">
            <span class="cmd-icon">⌘</span>
            <span>K</span>
          </div>
        </div>

        <div class="topbar-actions">
          <button @click="toggleTheme" class="theme-toggle-btn">
            <Transition name="theme-icon-swap" mode="out-in">
              <svg
                v-if="currentTheme != 'light'"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="sun theme-switch"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />
              </svg>

              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="moon theme-switch"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </svg>
            </Transition>
          </button>
          <button @click="handleSignOut" class="logout-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="signout"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="main-container">
      <div class="sidebar">
        <div class="sidebar-content">
          <nav class="sidebar-nav">
            <ul class="nav-list">
              <div v-for="(item, index) in menuItems" :key="index" class="li-wrapper">
                <li class="nav-li" :class="{ active: item.active }">
                  <div
                    v-if="item.children && item.children.length > 0"
                    class="menu-item expandable"
                    @click="toggleExpand(item)"
                  >
                    <div class="menu-link">
                      <div class="menu-content">
                        <i :class="item.icon"></i>
                        <span>{{ item.title }}</span>
                      </div>
                      <i
                        v-if="item.children.length > 0"
                        class="expand-icon"
                        :class="item.expanded ? 'expanded' : ''"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          width="16"
                          height="16"
                          class="chevron"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </i>
                    </div>
                  </div>

                  <div v-else class="menu-item">
                    <RouterLink :to="item.path" class="menu-link">
                      <div class="menu-content">
                        <i :class="item.icon"></i>
                        <span>{{ item.title }}</span>
                      </div>
                    </RouterLink>
                  </div>

                  <div v-if="item.children && item.expanded" class="submenu">
                    <ul>
                      <li v-for="(child, childIndex) in item.children" :key="childIndex">
                        <div class="submenu-link" :class="{ active: child.active }">
                          <RouterLink :to="child.path">
                            <i v-if="child.icon" :class="child.icon"></i>
                            <span>{{ child.title }}</span>
                          </RouterLink>
                        </div>
                      </li>
                    </ul>
                  </div>
                </li>
              </div>
            </ul>
          </nav>
        </div>
      </div>
      <div class="content-area">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.topbar {
  height: 2.4rem;
  background-color: var(--background);
  display: flex;
  align-items: center;
  padding: 0 8px;
  z-index: 10;
}

.topbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.abz {
  cursor: default;
  font-size: 2rem;
  color: var(--text-primary);
  font-weight: bold;
}

.app-title {
  cursor: default;
  font-size: 2rem;
  color: var(--text-primary);
  text-decoration: underline;
  font-weight: bold;
}

.topbar-actions {
  display: flex;
  gap: 10px;
}

.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  background-color: var(--background);
  overflow-y: auto;
}

.sidebar-content {
  padding: 4px 0px;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  padding: 0;
}

.sidebar-nav a {
  text-decoration: none;
}

.submenu {
  padding-left: 16px !important;
  background-color: var(--background);
}

/* alterar */
.menu-title {
  display: block;
  padding: 8px 0;
  text-decoration: none;
  color: var(--text-primary);
  transition:
    background-color 0.2s,
    color 0.3s ease;
  flex-grow: 1;
}

.sidebar-nav a {
  display: block;
  padding: 8px 0px;
  text-decoration: none;
  color: var(--text-primary);
  transition: background-color 0.2s;
}

.content-area {
  flex: 1;
  /* TODO: check height */
  height: calc(100vh - 2.1rem);
  border-top: 1px solid var(--divider);
  border-left: 1px solid var(--divider);
  background-color: var(--surface);
  border-top-left-radius: 6px;
  overflow: hidden;
  padding: 0px;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 1.9rem;
  width: 18%;
  max-width: 400px;
  background-color: var(--input-background);
  border-radius: 6px;
  transition: all 0.2s ease;
  padding-left: 8px;
  padding-right: 6px;
}

.search-container:hover {
  border-radius: 0px;
}

.search-container:focus-within {
  border-radius: 0px;
  box-shadow: 0 0 0 2px var(--focus-ring-color);
}

.search-icon {
  flex-shrink: 0;
  color: var(--text-secondary);
  height: 16px;
  width: 16px;
  margin-right: 8px;
  transform: scaleX(-1);
}

.search-input {
  flex: 1;
  cursor: pointer;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 0.9rem;
  height: 100%;
  padding: 0;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.shortcut-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  padding: 2px 5px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  user-select: none;
}

.cmd-icon {
  font-size: 0.8rem;
  margin-right: 2px;
  margin-top: 2px;
}

.search-container:focus-within .shortcut-indicator {
  display: none;
}

.search-container:hover .shortcut-indicator {
  border-radius: 0px;
}

.theme-toggle-btn,
.logout-btn {
  padding: 4px;
  background: none;
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 6px;
  cursor: pointer;
  line-height: 0;
  transition:
    background 0.2s ease,
    border 0.2s ease;
}

.theme-toggle-btn:hover,
.logout-btn:hover {
  background: var(--surface);
  border: 1px solid var(--border);
}

.main-logo {
  position: relative;
  color: var(--text-primary);
  top: 5px;
  height: 2rem;
  width: 2rem;
}

.theme-switch,
.signout {
  color: var(--text-primary);
  height: 1.4rem;
  width: 1.4rem;
  display: block;
  transition: color 0.2s ease;
}

.theme-icon-swap-enter-active,
.theme-icon-swap-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.theme-icon-swap-enter-from,
.theme-icon-swap-leave-to {
  opacity: 0;
  transform: scale(0.6) rotate(-30deg);
}

.sidebar-nav {
  width: 100%;
  background-color: transparent;
  color: var(--text-primary);
}

.nav-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.li-wrapper {
  margin: 0px 6px;
  padding: 0;
}

.nav-li {
  position: relative;
}

.menu-item {
  cursor: pointer;
}

.menu-link {
  display: flex;
  user-select: none;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0px;
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 2px;
  padding-right: 4px;
  font-size: 1rem;
  text-decoration: none;
}

.menu-link:hover {
  background-color: var(--surface);
  border: 1px solid var(--border);
  text-decoration: underline;
}

.menu-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.active .menu-link {
  background-color: var(--surface);
  border-left: 4px solid var(--focus-ring-color);
}

.chevron {
  position: relative;
  top: 2px;
}

.expand-icon .chevron {
  transition: transform 0.15s linear;
}

.expand-icon.expanded .chevron {
  transform: rotate(180deg);
}

.submenu {
  font-size: 0.9rem;
}

.submenu ul {
}

.submenu-link {
  display: flex;
  cursor: pointer;
  align-items: center;
  padding: 0px 4px;
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 2px;
  text-decoration: none;
}

.submenu-link:hover {
  background-color: var(--surface);
  border: 1px solid var(--border);
  text-decoration: underline;
}

.active.submenu-link {
  background-color: var(--surface);
  border-left: 3px solid var(--focus-ring-color);
}
</style>
