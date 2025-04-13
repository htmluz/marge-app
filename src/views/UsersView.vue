<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '@/services/apiClient'
import UserCreateModal from '@/components/UserCreateModal.vue'

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
const show_create_modal = ref(false)

const fetchUsers = async () => {
  try {
    const response = await apiClient.get('/users/all')
    users.value = response.data.users
    console.log(users.value)
  } catch (err) {
    error.value = 'Erro buscando usuários'
    console.error(err)
  }
}

const openCreateModal = () => {
  show_create_modal.value = true
}

const closeCreateModal = () => {
  show_create_modal.value = false
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="default-container">
    <div class="users-header">
      <h2 class="content-title">Users</h2>
      <button class="primary-button p-button" @click="openCreateModal">
        <i class="icon-plus"></i> New User
      </button>
    </div>

    <div v-if="users.length > 0" class="table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="user-row">
            <td>{{ user.username }}</td>
            <td>{{ user.full_name }}</td>
            <td>
              <div class="roles-container">
                <span v-for="role in user.roles_perms" :key="role.role_id" class="role-badge">
                  {{ role.role_name }}
                </span>
                <span v-if="!user.roles_perms || user.roles_perms.length === 0" class="no-roles">
                  Nenhuma permissão
                </span>
              </div>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn-edit" title="Edit User">
                  <i class=""></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <UserCreateModal v-if="show_create_modal" @close="closeCreateModal" />
  </div>
</template>

<style scoped>
.users-container {
  background-color: var(--surface);
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--shadow);
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.p-button {
  padding: 4px 12px;
  font-size: 0.9rem;
}

.icon-plus::before {
  content: '+';
  font-weight: bold;
}

.table-container {
  overflow-x: auto;
  flex-grow: 1;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.users-table th {
  text-align: left;
  padding: 12px 16px;
  background-color: var(--background);
  color: var(--text-primary);
  font-weight: 600;
  border-bottom: 1px solid var(--border);
}

.users-table td {
  padding: 4px 16px;
  border-bottom: 1px solid var(--divider);
  color: var(--text-primary);
}

.user-row:hover {
  background-color: var(--overlay);
}

.roles-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.role-badge {
  background-color: var(--input-background);
  color: var(--text-secondary);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.no-roles {
  color: var(--text-disabled);
  font-style: italic;
  font-size: 12px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-edit {
  background-color: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s;
}

.icon-edit::before {
  content: '✎';
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  color: var(--text-secondary);
  flex-grow: 1;
  gap: 16px;
}

.empty-state p {
  margin: 0 0 16px 0;
}
</style>
