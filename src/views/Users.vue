<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Пользователи</h1>
      <a-button type="primary" @click="handleAdd">
        <template #icon><PlusOutlined /></template>
        Создать пользователя
      </a-button>
    </div>

    <a-table :columns="columns" :data-source="users" :loading="loading" row-key="_id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'role'">
          <a-tag :color="getRoleColor(record.role)">
            {{ getRoleName(record.role) }}
          </a-tag>
        </template>
        <template v-if="column.key === 'actions'">
          <a-space>
            <a-button type="link" @click="handleEdit(record)">Редактировать</a-button>
            <a-popconfirm title="Удалить пользователя?" @confirm="handleDelete(record._id)">
              <a-button type="link" danger>Удалить</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <AddUserDrawer
      v-model:open="showDrawer"
      :userToEdit="editingUser"
      @userAdded="fetchUsers"
      @userUpdated="fetchUsers"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '../stores/auth';
import AddUserDrawer from '../components/AddUserDrawer.vue';

const users = ref([]);
const loading = ref(false);
const showDrawer = ref(false);
const editingUser = ref(null);

const columns = [
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Роль', dataIndex: 'role', key: 'role' },
  { title: 'Действия', key: 'actions' }
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
  waiter: 'Официант',
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
    case 'waiter': return 'orange';
    default: return 'default';
  }
};

const fetchUsers = async () => {
  const authStore = useAuthStore();
  loading.value = true;
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const res = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    users.value = res.data;
  } catch (e) {
    console.error(e);
    message.error("Не удалось загрузить пользователей");
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  editingUser.value = null;
  showDrawer.value = true;
};

const handleEdit = (user) => {
  editingUser.value = user;
  showDrawer.value = true;
};

const handleDelete = async (id) => {
  const authStore = useAuthStore();
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    await axios.delete(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    message.success("Пользователь удален");
    fetchUsers();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при удалении");
  }
};

onMounted(fetchUsers);
</script>
