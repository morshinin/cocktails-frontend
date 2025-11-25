<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">📅 График смен</h1>
      <a-button type="primary" @click="showAddDrawer = true">
        <template #icon><PlusOutlined /></template>
        Добавить смену
      </a-button>
    </div>

    <!-- Simple List View for now, can be upgraded to Calendar later -->
    <a-list :grid="{ gutter: 16, column: 3 }" :data-source="shifts">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-card :title="formatDate(item.startTime)">
            <template #extra>
              <a-popconfirm title="Удалить смену?" @confirm="deleteShift(item._id)">
                <DeleteOutlined class="text-red-500 cursor-pointer" />
              </a-popconfirm>
            </template>
            <div class="mb-2">
              <strong>Сотрудник:</strong> {{ item.userId?.email || 'Unknown' }}
            </div>
            <div class="mb-2">
              <strong>Время:</strong> {{ formatTime(item.startTime) }} - {{ formatTime(item.endTime) }}
            </div>
            <div v-if="item.role">
              <strong>Роль:</strong> {{ item.role }}
            </div>
          </a-card>
        </a-list-item>
      </template>
    </a-list>

    <AddShiftDrawer
      v-model:open="showAddDrawer"
      @shiftAdded="fetchShifts"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { useAuthStore } from '../stores/auth';
import AddShiftDrawer from '../components/AddShiftDrawer.vue';
import dayjs from 'dayjs';

const shifts = ref([]);
const showAddDrawer = ref(false);

const fetchShifts = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;
  
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const res = await axios.get(`${API_URL}/shifts`, {
      params: { venueId: authStore.selectedVenue._id },
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    // Sort by start time descending
    shifts.value = res.data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  } catch (e) {
    console.error(e);
    message.error("Ошибка при загрузке графика");
  }
};

const deleteShift = async (id) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    await axios.delete(`${API_URL}/shifts/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    message.success("Смена удалена");
    fetchShifts();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при удалении");
  }
};

const formatDate = (date) => dayjs(date).format('DD.MM.YYYY');
const formatTime = (date) => dayjs(date).format('HH:mm');

onMounted(fetchShifts);
</script>
