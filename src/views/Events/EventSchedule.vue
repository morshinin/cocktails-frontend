<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">График мероприятий</h1>
      <div class="flex gap-4">
        <a-date-picker v-model:value="selectedDate" @change="fetchEvents" />
        <a-button type="primary" @click="showDrawer">
          <template #icon><PlusOutlined /></template>
          Новое событие
        </a-button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div v-if="events.length === 0" class="text-center text-gray-400 py-12">
        На этот день ничего не запланировано
      </div>
      <div v-for="event in events" :key="event._id" class="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col md:flex-row gap-6">
        <div class="w-full md:w-48 h-32 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            :src="event.imageUrl || 'https://via.placeholder.com/300x200?text=Event'" 
            class="w-full h-full object-cover"
          />
        </div>
        <div class="flex-grow">
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl font-bold text-white">{{ event.startTime }}</span>
                <span v-if="event.endTime" class="text-gray-400">- {{ event.endTime }}</span>
                <a-tag :color="getStatusColor(event.status)">{{ getStatusLabel(event.status) }}</a-tag>
              </div>
              <h2 class="text-xl font-semibold text-white mb-2">{{ event.title }}</h2>
              <p class="text-gray-400 mb-4">{{ event.description }}</p>
              <div v-if="event.djId" class="flex items-center gap-2 text-gray-300">
                <UserOutlined />
                <span>DJ: {{ event.djId.name }}</span>
              </div>
            </div>
            <div class="flex gap-2">
              <a-button type="text" @click="editEvent(event)">
                <template #icon><EditOutlined class="text-blue-400" /></template>
              </a-button>
              <a-popconfirm title="Удалить событие?" @confirm="deleteEvent(event._id)">
                <a-button type="text">
                  <template #icon><DeleteOutlined class="text-red-500" /></template>
                </a-button>
              </a-popconfirm>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AddEventDrawer
      v-model:visible="drawerVisible"
      :event="editingEvent"
      @submit="handleDrawerSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import dayjs from 'dayjs';
import AddEventDrawer from '../../components/Events/AddEventDrawer.vue';

const events = ref([]);
const drawerVisible = ref(false);
const editingEvent = ref(null);
const selectedDate = ref(dayjs());

const getStatusColor = (status) => {
  switch (status) {
    case 'Scheduled': return 'blue';
    case 'Completed': return 'green';
    case 'Cancelled': return 'red';
    default: return 'default';
  }
};

const getStatusLabel = (status) => {
  const labels = {
    'Scheduled': 'Запланировано',
    'Completed': 'Завершено',
    'Cancelled': 'Отменено'
  };
  return labels[status] || status;
};

const fetchEvents = async () => {
  try {
    const dateStr = selectedDate.value.format('YYYY-MM-DD');
    const response = await axios.get('/api/events/schedule', {
      params: { date: dateStr }
    });
    events.value = response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    message.error('Не удалось загрузить события');
  }
};

const showDrawer = () => {
  editingEvent.value = null;
  drawerVisible.value = true;
};

const editEvent = (event) => {
  editingEvent.value = event;
  drawerVisible.value = true;
};

const deleteEvent = async (id) => {
  try {
    await axios.delete(`/api/events/schedule/${id}`);
    message.success('Событие удалено');
    fetchEvents();
  } catch (error) {
    console.error('Error deleting event:', error);
    message.error('Не удалось удалить событие');
  }
};

const handleDrawerSubmit = async (formData) => {
  try {
    if (formData._id) {
      await axios.put(`/api/events/schedule/${formData._id}`, formData);
      message.success('Событие обновлено');
    } else {
      await axios.post('/api/events/schedule', formData);
      message.success('Событие создано');
    }
    fetchEvents();
  } catch (error) {
    console.error('Error saving event:', error);
    message.error('Не удалось сохранить событие');
  }
};

onMounted(() => {
  fetchEvents();
});
</script>
