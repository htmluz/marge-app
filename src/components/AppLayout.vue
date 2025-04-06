<script setup lang="ts">
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
</script>

<template>
  <div class="app-layout">
    <div class="topbar">
      <div class="topbar-content">
        <span class="app-title">Marge</span>
        <div class="topbar-actions">
          <button @click="toggleTheme" class="theme-toggle-btn">Theme:</button>
          <button @click="handleSignOut" class="logout-btn">SignOut</button>
        </div>
      </div>
    </div>

    <div class="main-container">
      <div class="sidebar">
        <div class="sidebar-content">
          <nav class="sidebar-nav">
            <ul>
              <li>
                <RouterLink to="/dashboard">Dashboard</RouterLink>
              </li>
              <li>
                <RouterLink to="/calls">Calls</RouterLink>
              </li>
              <li>
                <RouterLink to="/abc">teste</RouterLink>
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
  background-color: var(--background-color);
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

.app-title {
  font-size: 1.8rem;
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
  background-color: var(--background-color);
  /* border-right: 1px solid var(--border-color); */
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
  border-bottom: 1px solid var(--border-color);
}

.sidebar-nav a {
  display: block;
  padding: 8px 8px;
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.2s;
}

.sidebar-nav a:hover,
.sidebar-nav a.router-link-active {
  background-color: var(--hover-bg);
}

.content-area {
  flex: 1;
  border-top: 1px solid var(--border-color);
  border-left: 1px solid var(--border-color);
  border-top-left-radius: 6px;
  overflow-y: auto;
  padding: 20px;
}

.theme-toggle-btn,
.logout-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: var(--button-bg);
  color: var(--button-text);
  cursor: pointer;
}

.theme-toggle-btn:hover,
.logout-btn:hover {
  background-color: var(--button-hover-bg);
}
</style>
