<script setup lang="ts">
import { ref } from 'vue'
import apiClient from '@/services/apiClient'

interface Role {
  id: number
  name: string
  description: string
  created_at: Date
}

const emit = defineEmits(['close', 'user-created'])

const username = ref('')
const password = ref('')
const full_name = ref('')
const email = ref('')
const selected_roles = ref<number[]>([])
const is_submitting = ref(false)
const error = ref('')
const available_roles = ref<Role[]>([])

const fetchRoles = async () => {
  try {
    const response = await apiClient.get('/users/roles')
    available_roles.value = response.data.roles
  } catch (err) {
    console.error(err)
  }
}

const createUser = async () => {
  if (!username.value || !password.value || !full_name.value || !email.value) {
    error.value = 'Fill all the required fields'
    return
  }
  is_submitting.value = true
  try {
    const response = await apiClient.post('/users/create', {
      username: username.value,
      password: password.value,
      email: email.value,
      full_name: full_name.value,
      roles: selected_roles.value,
    })

    emit('user-created', response.data.message)
    emit('close')
  } catch (err) {
    error.value = `Error creating user: ${err}`
    console.error(err)
  } finally {
    is_submitting.value = false
  }
}

const toggleRole = (roleId: number) => {
  const index = selected_roles.value.indexOf(roleId)
  if (index === -1) {
    selected_roles.value.push(roleId)
  } else {
    selected_roles.value.splice(index, 1)
  }
}

fetchRoles()
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <div class="zzz">
          <h3>Create new user</h3>
          <div v-if="error" class="error-message">{{ error }}</div>
        </div>
        <button class="btn-close" @click="$emit('close')">×</button>
      </div>

      <div class="modal-body">
        <div class="modal-inputs">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              class="primary-input"
              id="username"
              v-model="username"
              type="text"
              placeholder="Username"
              required
            />
          </div>

          <div class="form-group">
            <label for="full_name">Full Name</label>
            <input
              class="primary-input"
              id="full_name"
              v-model="full_name"
              type="text"
              placeholder="Full Name"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">E-mail</label>
            <input
              class="primary-input"
              id="email"
              v-model="email"
              type="email"
              placeholder="E-mail"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              class="primary-input"
              id="password"
              v-model="password"
              type="password"
              placeholder="********"
              required
            />
          </div>
        </div>

        <div class="modal-roles">
          <label>Roles</label>
          <div class="roles-selection">
            <div v-for="role in available_roles" :key="role.id" class="role-checkbox">
              <input
                type="checkbox"
                :id="`role-${role.id}`"
                :value="role.id"
                @change="toggleRole(role.id)"
                :checked="selected_roles.includes(role.id)"
              />
              <label :for="`role-${role.id}`">{{ role.name }}</label>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="secondary-button" @click="$emit('close')">Cancelar</button>
        <button class="primary-button p-button" @click="createUser" :disabled="is_submitting">
          {{ is_submitting ? 'Creating user...' : 'Create User' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: var(--background);
  border-radius: 6px;
  border: 1px solid var(--border);
  width: 100%;
  max-width: 850px;
  box-shadow: 0 4px 16px var(--shadow);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid var(--border);
}

.modal-header h3 {
  cursor: default;
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
}

.btn-close {
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 6px;
  font-size: 1.4rem;
  background: none;
  color: var(--text-primary);
  cursor: pointer;
  transition:
    background 0.2s ease,
    border 0.2s ease;
}

.btn-close:hover {
  background: var(--surface);
  border: 1px solid var(--border);
}

.modal-body {
  display: flex;
  padding: 16px;
}

.modal-body > div {
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
}

.form-group input {
  height: 2rem;
  font-size: 1rem;
  width: 95%;
}

.roles-selection {
  display: grid;
  background-color: var(--input-background);
  height: 86%;
  border-radius: 8px;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  transition: border-radius 0.2s ease;
}

.roles-selection:hover {
  border-radius: 0px;
}

.role-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 8px 16px;
  border-top: 1px solid var(--divider);
}

.btn-cancel {
  background-color: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
}

.p-button {
  height: 2rem;
  font-size: 1rem;
  padding: 0px 12px;
}

.error-message {
  cursor: default;
  background-color: #ffebee;
  color: #c62828;
  padding: 6px 16px;
  border-radius: 8px;
  margin-bottom: 0px;
  font-size: 14px;
}

.zzz {
  display: flex;
  width: 60%;
  justify-content: space-between;
  gap: 8px;
}
</style>
