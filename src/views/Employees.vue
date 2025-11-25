<template>
  <div class="p-6 max-w-5xl mx-auto">
    <a-page-header
      title="👥 Сотрудники"
      sub-title="Список персонала"
      :breadcrumb="{ routes: [{ path: '/employees', breadcrumbName: 'Сотрудники' }] }"
    >
      <template #extra>
        <router-link to="/users">
          <a-button>Управление пользователями</a-button>
        </router-link>
      </template>
    </a-page-header>

    <a-table :dataSource="users" :columns="columns" :loading="loading" rowKey="_id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'role'">
          <a-tag :color="getRoleColor(record.role)">
            {{ getRoleName(record.role) }}
          </a-tag>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { useAuthStore } from '../stores/auth';

const users = ref([]);
const loading = ref(false);
const authStore = useAuthStore();

const columns = [
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Роль',
    dataIndex: 'role',
    key: 'role',
  }
];

const roleNames = {
  developer: 'Разработчик',
  owner: 'Владелец',
  manager: 'Управляющий',
  head_bartender: 'Старший бармен',
  bartender: 'Бармен',
  head_chef: 'Шеф-повар',
  cook: 'Повар',
  cleaner: 'Клинер',
  guest: 'Гость'
};

const getRoleName = (role) => roleNames[role] || role;

const getRoleColor = (role) => {
  switch (role) {
    case 'developer': return 'purple';
    case 'owner': return 'gold';
    case 'manager': return 'cyan';
    case 'head_bartender': return 'blue';
    case 'bartender': return 'geekblue';
    default: return 'default';
  }
};

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
