<template>
  <div class="p-6 max-w-7xl mx-auto">
    <a-page-header
      title="👥 Сотрудники"
      sub-title="Список персонала"
      :breadcrumb="{ routes: [{ path: '/employees', breadcrumbName: 'Сотрудники' }] }"
    >
      <template #extra>
        <a-button type="primary" @click="showAddModal = true">
          ➕ Добавить сотрудника
        </a-button>
      </template>
    </a-page-header>

    <AddEmployeeDrawer
      v-model:visible="showAddModal"
      @success="fetchUsers"
    />

    <div v-if="loading" class="text-center py-12">
      <a-spin size="large" />
    </div>

    <div v-else>
      <a-row :gutter="[16, 16]">
        <a-col v-for="user in users" :key="user._id" :xs="24" :sm="12" :md="8">
          <EmployeeCard :employee="user" @delete="deleteUser" />
        </a-col>
      </a-row>
      
      <div v-if="users.length === 0" class="text-center py-12 text-gray-500">
        Сотрудники не найдены
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { useAuthStore } from '../stores/auth';
import EmployeeCard from '../components/EmployeeCard.vue';
import AddEmployeeDrawer from '../components/AddEmployeeDrawer.vue';

const users = ref([]);
const loading = ref(false);
const showAddModal = ref(false);
const authStore = useAuthStore();

const fetchUsers = async () => {
  if (!authStore.user) return;
  
  loading.value = true;
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const res = await axios.get(`${API_URL}/users`, {
        params: { organizationId: authStore.user.organizationId },
        headers: { Authorization: `Bearer ${authStore.token}` }
    });
    users.value = res.data;
  } catch (e) {
    console.error(e);
    message.error('Ошибка при загрузке сотрудников');
  } finally {
    loading.value = false;
  }
};

const deleteUser = async (id) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    await axios.delete(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    message.success('Сотрудник удален');
    await fetchUsers();
  } catch (e) {
    console.error(e);
    message.error('Ошибка при удалении сотрудника');
  }
};

onMounted(() => {
  if (authStore.user) {
    fetchUsers();
  }
});

watch(() => authStore.user, (newUser) => {
  if (newUser) {
    fetchUsers();
  }
});
</script>
