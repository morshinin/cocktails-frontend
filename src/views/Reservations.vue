<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">Резерв столов</h1>
      <div class="flex gap-4">
        <a-date-picker v-model:value="selectedDate" @change="fetchReservations" />
        <a-button type="primary" @click="showDrawer">
          <template #icon><PlusOutlined /></template>
          Новая бронь
        </a-button>
      </div>
    </div>

    <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <a-table :columns="columns" :data-source="reservations" :row-key="record => record._id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusLabel(record.status) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'time'">
            {{ record.time }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="editReservation(record)">Изменить</a>
              <a-popconfirm title="Удалить бронь?" @confirm="deleteReservation(record._id)">
                <a class="text-red-500">Удалить</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <AddReservationDrawer
      v-model:visible="drawerVisible"
      :reservation="editingReservation"
      @submit="handleDrawerSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import dayjs from 'dayjs';
import AddReservationDrawer from '../components/service/AddReservationDrawer.vue';

const reservations = ref([]);
const drawerVisible = ref(false);
const editingReservation = ref(null);
const selectedDate = ref(dayjs());

const columns = [
  { title: 'Время', key: 'time', width: 100 },
  { title: 'Имя', dataIndex: 'guestName', key: 'guestName' },
  { title: 'Гостей', dataIndex: 'guestsCount', key: 'guestsCount', width: 100 },
  { title: 'Стол', dataIndex: 'tableNumber', key: 'tableNumber', width: 100 },
  { title: 'Контакты', dataIndex: 'guestContact', key: 'guestContact' },
  { title: 'Статус', key: 'status', width: 120 },
  { title: 'Действия', key: 'action', width: 150 },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Confirmed': return 'blue';
    case 'Pending': return 'orange';
    case 'Seated': return 'green';
    case 'Completed': return 'purple';
    case 'Cancelled': return 'red';
    default: return 'default';
  }
};

const getStatusLabel = (status) => {
  const labels = {
    'Confirmed': 'Подтверждено',
    'Pending': 'Ожидает',
    'Seated': 'Посажены',
    'Completed': 'Завершено',
    'Cancelled': 'Отменено'
  };
  return labels[status] || status;
};

const fetchReservations = async () => {
  try {
    const dateStr = selectedDate.value.format('YYYY-MM-DD');
    const response = await axios.get('/api/reservations', {
      params: { date: dateStr }
    });
    reservations.value = response.data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    message.error('Не удалось загрузить брони');
  }
};

const showDrawer = () => {
  editingReservation.value = null;
  drawerVisible.value = true;
};

const editReservation = (reservation) => {
  editingReservation.value = reservation;
  drawerVisible.value = true;
};

const deleteReservation = async (id) => {
  try {
    await axios.delete(`/api/reservations/${id}`);
    message.success('Бронь удалена');
    fetchReservations();
  } catch (error) {
    console.error('Error deleting reservation:', error);
    message.error('Не удалось удалить бронь');
  }
};

const handleDrawerSubmit = async (formData) => {
  try {
    if (formData._id) {
      await axios.put(`/api/reservations/${formData._id}`, formData);
      message.success('Бронь обновлена');
    } else {
      await axios.post('/api/reservations', formData);
      message.success('Бронь создана');
    }
    fetchReservations();
  } catch (error) {
    console.error('Error saving reservation:', error);
    message.error('Не удалось сохранить бронь');
  }
};

onMounted(() => {
  fetchReservations();
});
</script>
