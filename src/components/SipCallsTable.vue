<script lang="ts">
import apiClient from '@/services/apiClient'
import { format } from 'date-fns'
import { computed, onMounted, reactive, ref, watch } from 'vue'

interface Call {
  sid: string
  create_date: string
  start_date: string
  end_date: string
  caller: string
  callee: string
  sip_status: string
}

interface CallsResponse {
  calls: Call[]
  page?: number
  page_size?: number
  total?: number
  total_pages?: number
}

interface CallsFilter {
  page: number
  per_page: number
  start_date: string
  end_date: string
  call_id?: string
  caller?: string
  callee?: string
  sip_status?: string
}

interface Column {
  key: keyof Call
  label: string
  format?: (value: any) => string
  input: boolean
}

const fetchCalls = async (filters: CallsFilter): Promise<CallsResponse> => {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== '') {
      params.append(key, String(val))
    }
  })

  const response = await apiClient.get<CallsResponse>('/sip/calls', { params })
  return response.data
}

export default {
  name: 'CallsTable',
  setup() {
    const calls = ref<Call[]>([])
    const loading = ref(false)
    const selected_calls = ref<Call[]>([])
    const current_page = ref(1)
    const total_calls = ref(0)
    const total_pages = ref(1)
    const page_size = ref(25)
    const has_more_pages = ref(false)

    const columns: Column[] = [
      {
        key: 'start_date',
        label: 'Start Date',
        format: (value: string) => formatDate(value),
        input: false,
      },
      {
        key: 'end_date',
        label: 'End Date',
        format: (value: string) => formatDate(value),
        input: false,
      },

      { key: 'caller', label: 'Caller', input: true },
      { key: 'callee', label: 'Callee', input: true },
      { key: 'sip_status', label: 'SIP Status', input: true },
      { key: 'sid', label: 'Call ID', input: true },
    ]

    const filtered_columns = computed(() => columns.filter((col) => col.input))

    const localFilters = reactive<CallsFilter>({
      page: 1,
      per_page: 25,
      start_date: '',
      end_date: '',
      call_id: '',
      caller: '',
      callee: '',
      sip_status: '',
    })

    const formatDate = (date_str: string): string => {
      if (!date_str) return ''
      try {
        const date = new Date(date_str)
        return format(date, 'dd/MM/yyyy HH:mm:ss')
      } catch {
        return date_str
      }
    }

    const toIsoString = (local_date: string): string => {
      if (!local_date) return ''
      try {
        const date = new Date(local_date)
        return date.toISOString()
      } catch {
        return ''
      }
    }

    const loadCalls = async () => {
      loading.value = true
      try {
        const filters = { ...localFilters }
        if (filters.start_date) {
          filters.start_date = toIsoString(filters.start_date)
        }
        if (filters.end_date) {
          filters.end_date = toIsoString(filters.end_date)
        }
        const res = await fetchCalls(filters)
        calls.value = res.calls
        total_calls.value = res.total || 0
        total_pages.value = res.total_pages || 1
        has_more_pages.value = current_page.value * page_size.value < total_calls.value
      } catch (err) {
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    const changePage = (page: number) => {
      current_page.value = page
      localFilters.page = page
      loadCalls()
    }

    const updatePageSize = (page_siz: number) => {
      page_size.value = page_siz
      localFilters.per_page = page_siz
      loadCalls()
    }

    const handleFilterChange = () => {
      current_page.value = 1
      localFilters.page = 1

      if (filterTimeout) clearTimeout(filterTimeout)
      filterTimeout = setTimeout(() => {
        loadCalls()
      }, 500)
    }

    let filterTimeout: number | null = null

    const isSelected = (call: Call) => {
      return selected_calls.value.some((selected) => selected.sid === call.sid)
    }

    const toggleSelect = (call: Call) => {
      if (isSelected(call)) {
        selected_calls.value = selected_calls.value.filter((selected) => selected.sid !== call.sid)
      } else {
        selected_calls.value.push(call)
      }
    }

    watch(current_page, (new_page) => {
      localFilters.page = new_page
    })

    onMounted(() => {
      loadCalls()
    })

    return {
      calls,
      loading,
      columns,
      filtered_columns,
      localFilters,
      current_page,
      total_calls,
      total_pages,
      has_more_pages,
      selected_calls,
      isSelected,
      toggleSelect,
      handleFilterChange,
      changePage,
      updatePageSize,
      page_size,
    }
  },
}
</script>

<template>
  <div class="calls-root">
    <div class="filters-container">
      <div class="filter-row">
        <div v-for="column in filtered_columns" :key="column.key" class="filter-item">
          <label class="filter-label" :for="`filter-${column.key}`">{{ column.label }}</label>
          <input
            :id="`filter-${column.key}`"
            v-model="localFilters[column.key]"
            type="text"
            class="primary-input p-input"
            :placeholder="`${column.label}`"
            @input="handleFilterChange"
          />
        </div>
        <div class="filter-item date-filter">
          <label class="filter-label" for="filter-start-date">Start Date</label>
          <input
            class="primary-input p-input date-input"
            id="filter-start-date"
            v-model="localFilters.start_date"
            type="datetime-local"
            @input="handleFilterChange"
          />
        </div>
        <div class="filter-item date-filter">
          <label class="filter-label" for="filter-end-date">End Date</label>
          <input
            class="primary-input p-input date-input"
            id="filter-end-date"
            v-model="localFilters.end_date"
            type="datetime-local"
            @input="handleFilterChange"
          />
        </div>
      </div>
    </div>
    <div class="table-wrapper">
      <table class="calls-table">
        <thead>
          <tr class="">
            <th class="select-column"></th>
            <th v-for="column in columns" :key="column.key">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="call in calls" :key="call.sid" :class="{ selected: isSelected(call) }">
            <td class="select-column">
              <input type="checkbox" :checked="isSelected(call)" @change="toggleSelect(call)" />
            </td>
            <td v-for="column in columns" :key="column.key">
              <template v-if="column.format">
                {{ column.format(call[column.key]) }}
              </template>
              <template v-else>
                {{ call[column.key] }}
              </template>
            </td>
          </tr>
          <tr v-if="!loading && calls.length === 0">
            <td :colspan="columns.length + 1" class="empty-row">No calls Found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <div class="info">
        <select v-model.number="page_size" @change="updatePageSize(page_size)">
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
          <option :value="500">500</option>
        </select>
        <span>{{ total_calls }} Calls</span>
      </div>
      <div class="page-navigator">
        <button :disabled="current_page <= 1" @click="changePage(current_page - 1)">
          Previous Page
        </button>
        <span>Page {{ current_page }} of {{ total_pages }}</span>
        <button :disabled="!has_more_pages" @click="changePage(current_page + 1)">Next Page</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calls-root {
  height: 90%;
  max-height: 90%;
}

.calls-table-container {
  width: 100%;
  overflow-x: auto;
}

.filters-container {
  padding: 6px 8px;
  background-color: var(--background);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  min-width: 100px;
}

.date-filter {
  min-width: 200px;
}

.date-input {
  min-width: 200px;
}

.table-wrapper {
  overflow-y: auto;
  max-height: 800px;
}

.calls-table {
  /* display: block; */
  width: 100%;
  max-height: 800px;
  table-layout: fixed;
  background-color: var(--background);
  border: 1px solid var(--border);
  border-bottom: none;
  border: none;
  /* border-collapse: collapse; */
}

.calls-table thead {
  width: 100%;
  position: sticky;
  top: 0;
}

.calls-table th,
.calls-table td {
  cursor: default;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.calls-table td {
  font-size: 0.9rem;
  padding: 4px 0px;
}

.calls-table th {
  font-size: 1rem;
  padding: 8px 0px;
  background-color: var(--background);
  font-weight: 600;
}

.calls-table tr.selected {
  background-color: #e6f7ff;
}

.select-column {
  width: 40px;
  text-align: center;
}

.loading-row,
.empty-row {
  text-align: center;
  padding: 0.8rem;
  color: #64748b;
}

.pagination {
  font-size: 1rem;
  background-color: var(--background);
  display: flex;
  border: 1px solid var(--border);
  border-top: 0px;
  border: none;
  padding: 8px 6px;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.pagination button {
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.info {
  display: flex;
  gap: 6px;
}

.page-navigator {
  display: flex;
  gap: 6px;
}

.p-input {
  height: 1.8rem;
  font-size: 1rem;
  max-width: 180px;
}

.filter-label {
  font-size: 0.9rem;
  margin-bottom: 2px;
  margin-left: 2px;
  font-weight: 600;
}
</style>
