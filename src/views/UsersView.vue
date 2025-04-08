<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '@/services/apiClient'

interface User {
  id: number
  username: string
  roles_perms: RolePerms[]
  full_name: string
}

interface RolePerms {
  role_id: number
  role_name: string
}

const users = ref<User[]>([])
const error = ref('')

const fetchUsers = async () => {
  try {
    const response = await apiClient.get('/users')
    users.value = response.data.users
    console.log(users.value)
  } catch (err) {
    error.value = 'Erro buscando usuários'
    console.error(err)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div id="main-container">
    <div class="container-header">
      <h2 class="users-title">Users</h2>
    </div>
    <table class="users-table">
      <thead>
        <tr class="header-row">
          <th>Username</th>
          <th>Full Name</th>
          <th>Roles</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="user-row">
          <td>{{ user.username }}</td>
          <td>{{ user.full_name }}</td>
          <td>Roles</td>
          <td>
            <button class="users-edit">i</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
#main-container {
  background-color: var(--surface);
  padding: 8px;
}

.users-title {
  margin-top: 0px;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table tbody tr:nth-child(odd) {
  background-color: var(--muted-background-color);
}

.users-table tbody tr:nth-child(odd):hover {
  background-color: var(--hover-background-color);
}

.user-row td {
  line-height: 2.1rem;
  /* padding: 6px 0px; */
}

.user-row:hover {
  background-color: var(--hover-background-color);
  transition: background-color 0.05s ease;
}

.header-row th {
  text-align: left;
  padding: 0px 0px;
  border-bottom: 1px solid var(--border-color);
}

.users-edit {
  position: relative;
  top: -2px;
  cursor: pointer;
  border: none;
  background-color: var(--button-background-color);
  color: var(--button-text-color);
  height: 1.3rem;
  width: 1.3rem;
  border-radius: 4px;
  transition: border-radius 0.15s ease;
}

.users-edit:hover {
  border-radius: 0px;
}
</style>
