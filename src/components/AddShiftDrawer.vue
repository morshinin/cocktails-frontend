<template>
  <a-drawer
    title="Добавить смену"
    :width="500"
    :open="open"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form layout="vertical" :model="formState">
      <a-form-item label="Сотрудник" required>
        <a-select
          v-model:value="formState.userId"
          placeholder="Выберите сотрудника"
          :options="userOptions"
        />
      </a-form-item>
      
      <a-form-item label="Дата и время начала" required>
        <a-date-picker 
            v-model:value="formState.startTime" 
            show-time 
            format="YYYY-MM-DD HH:mm" 
            style="width: 100%" 
        />
      </a-form-item>

      <a-form-item label="Дата и время окончания" required>
        <a-date-picker 
            v-model:value="formState.endTime" 
            show-time 
            format="YYYY-MM-DD HH:mm" 
            style="width: 100%" 
        />
      </a-form-item>

      <a-form-item label="Роль на смене">
        <a-input v-model:value="formState.role" placeholder="Например: Бармен" />
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="onClose">Отмена</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          Создать
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { useAuthStore } from '../stores/auth';
import dayjs from 'dayjs';

const props = defineProps({
  open: Boolean
});

const emit = defineEmits(['update:open', 'shiftAdded']);

const loading = ref(false);
const users = ref([]);
const userOptions = ref([]);
const authStore = useAuthStore();

const formState = reactive({
  userId: undefined,
  startTime: undefined,
  endTime: undefined,
  role: ''
});

const fetchUsers = async () => {
  if (!authStore.user) return;

  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const res = await axios.get(`${API_URL}/users`, {
        params: { organizationId: authStore.user.organizationId },
        headers: { Authorization: `Bearer ${authStore.token}` }
    });
    users.value = res.data;
    userOptions.value = res.data.map(u => ({
        label: u.email + (u.name ? ` (${u.name})` : ''),
        value: u._id
    }));
  } catch (e) {
    console.error(e);
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

const onClose = () => {
  emit('update:open', false);
};

const handleSubmit = async () => {
  const authStore = useAuthStore();
  
  if (!formState.userId || !formState.startTime || !formState.endTime) {
    return message.warning("Заполните обязательные поля");
  }

  loading.value = true;
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    await axios.post(`${API_URL}/shifts`, {
      userId: formState.userId,
      venueId: authStore.selectedVenue._id,
      startTime: formState.startTime.toDate(),
      endTime: formState.endTime.toDate(),
      role: formState.role
    });
    message.success("Смена создана!");
    
    // Reset form
    formState.userId = undefined;
    formState.startTime = undefined;
    formState.endTime = undefined;
    formState.role = '';
    
    emit('shiftAdded');
    onClose();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при создании смены");
  } finally {
    loading.value = false;
  }
};
</script>
