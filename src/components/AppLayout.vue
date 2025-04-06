<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

defineProps({
  currentTheme: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['toggle-theme', 'sign-out'])

const toggleTheme = () => {
  emit('toggle-theme')
}

const handleSignOut = () => {
  emit('sign-out')
}

interface MenuItem {
  title: string
  path: string | null
  expanded: boolean
  children: MenuOptions[]
}

interface MenuOptions {
  title: string
  path: string
}

const menuItems = ref<MenuItem[]>([
  {
    title: 'Dashboard',
    path: '/dashboard',
    expanded: false,
    children: [],
  },
  {
    title: 'SIP',
    path: null,
    expanded: false,
    children: [
      { title: 'Calls', path: '/sip/calls' },
      { title: 'Register', path: '/sip/register' },
    ],
  },
  {
    title: 'Settings',
    path: null,
    expanded: false,
    children: [
      { title: 'Profile', path: '/settings/me' },
      { title: 'Permissions', path: '/settings/permissions' },
      { title: 'Users', path: '/settings/users' },
    ],
  },
  {
    title: 'teste',
    path: '/testes',
    expanded: false,
    children: [],
  },
])

const toggleExpand = (item: MenuItem) => {
  item.expanded = !item.expanded
}

const hasChildren = (item: MenuItem) => {
  return item.children && item.children.length > 0
}

// TODO: handlers for ctrl+k
onMounted(() => {})

onUnmounted(() => {})
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
            <ul>
              <li v-for="(item, index) in menuItems" :key="index">
                <div
                  class="menu-item"
                  @click="hasChildren(item) ? toggleExpand(item) : null"
                  :class="{ 'has-children': hasChildren(item) }"
                >
                  <RouterLink v-if="item.path" :to="item.path" @click.stop class="menu-link">
                    {{ item.title }}
                  </RouterLink>
                  <span v-else class="menu-title">{{ item.title }}</span>
                  <span v-if="hasChildren(item)" class="expand-icon">
                    {{ item.expanded ? '-' : '+' }}
                  </span>
                </div>
                <ul v-if="hasChildren(item) && item.expanded" class="submenu">
                  <li v-for="(child, childIndex) in item.children" :key="childIndex">
                    <RouterLink :to="child.path" class="submenu-link">
                      {{ child.title }}
                    </RouterLink>
                  </li>
                </ul>
              </li>
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
  background-color: var(--faded-secondary-color);
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
  color: var(--primary-color);
  font-weight: bold;
}

.app-title {
  cursor: default;
  font-size: 2rem;
  color: var(--primary-color);
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
  background-color: var(--faded-secondary-color);
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

.menu-item {
  display: flex;
  justify-content: space-between;
  text-decoration: none;
  align-items: center;
  padding: 0 6px;
  cursor: pointer;
}

.menu-item a {
  color: var(--text-color);
  transition: color 0.3s ease;
}

.menu-item a:hover {
  color: var(--hover-text-color);
  background-color: var(--primary-color);
}

.menu-item.has-children {
  cursor: pointer;
}

.expand-icon {
  font-size: 0.8rem;
  transition: transform 0.2s;
}

.submenu {
  padding-left: 16px !important;
  background-color: var(--background-color);
}

.submenu-link {
  display: block;
  padding: 6px 8px;
  text-decoration: none;
  color: var(--text-color);
  font-size: 0.9rem;
  margin-left: 6px;
  position: relative;
  transition: color 0.3s ease;
}

.submenu-link::before {
  content: 'L';
  position: absolute;
  color: var(--text-color);
  top: 0.2rem;
  left: -12px;
  opacity: 0.7;
  transition: color 0.3s ease;
}

.submenu-link:hover {
  color: var(--hover-text-color);
}

.menu-title {
  display: block;
  padding: 8px 0;
  text-decoration: none;
  color: var(--text-color);
  transition:
    background-color 0.2s,
    color 0.3s ease;
  flex-grow: 1;
}

.menu-title:hover {
  color: var(--hover-text-color);
}

.sidebar-nav a {
  display: block;
  padding: 8px 0px;
  text-decoration: none;
  color: var(--text-color);
  transition: background-color 0.2s;
}

.content-area {
  flex: 1;
  border-top: 1px solid var(--focus-ring-color);
  border-left: 1px solid var(--focus-ring-color);
  border-top-left-radius: 16px;
  overflow-y: auto;
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
  background-color: var(--faded-primary-color);
  border-radius: 8px;
  transition: all 0.2s ease;
  padding-left: 8px;
  padding-right: 6px;
}

.search-container:hover {
  border-radius: 0px;
  background-color: var(--faded-focus-primary-color);
}

.search-container:focus-within {
  background-color: var(--faded-focus-primary-color);
  border-radius: 0px;
  box-shadow: 0 0 0 2px var(--focus-ring-color);
}

.search-icon {
  flex-shrink: 0;
  color: var(--muted-text-color);
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
  color: var(--text-color);
  font-size: 0.9rem;
  height: 100%;
  padding: 0;
  outline: none;
}

.search-input::placeholder {
  color: var(--muted-text-color);
}

.shortcut-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  padding: 2px 5px;
  background-color: var(--shortcut-bg-color, rgba(0, 0, 0, 0.07));
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--muted-text-color);
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
  border: none;
  border-radius: 6px;
  cursor: pointer;
  line-height: 0;
  transition: background 0.2s ease;
}

.theme-toggle-btn:hover {
  background: var(--faded-primary-color);
}

.logout-btn:hover {
  background: var(--faded-primary-color);
}

.logout-btn:hover .signout {
  color: var(--text-color);
}

.main-logo {
  position: relative;
  color: var(--primary-color);
  top: 5px;
  height: 2rem;
  width: 2rem;
}

.theme-switch,
.signout {
  color: var(--primary-color);
  height: 1.4rem;
  width: 1.4rem;
  display: block;
  transition: color 0.2s ease;
}

.theme-toggle-btn:hover .theme-switch {
  color: var(--text-color);
}

.theme-icon-swap-enter-active,
.theme-icon-swap-leave-active {
  transition:
    opacity 0.1s ease,
    transform 0.1s ease;
}

.theme-icon-swap-enter-from,
.theme-icon-swap-leave-to {
  opacity: 0;
  transform: scale(0.6) rotate(-30deg);
}
</style>
