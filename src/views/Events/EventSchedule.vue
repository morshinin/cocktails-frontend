<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">График мероприятий</h1>
      <a-button type="primary" @click="showDrawer">
        <template #icon><PlusOutlined /></template>
        Новое событие
      </a-button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="events.length === 0" class="col-span-full text-center text-gray-400 py-12">
        Нет запланированных мероприятий
      </div>
      <EventCard
        v-for="event in events"
        :key="event._id"
        :event="event"
        @edit="editEvent"
        @delete="deleteEvent"
      />
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
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import { useAuthStore } from '../../stores/auth.js';
import AddEventDrawer from '../../components/Events/AddEventDrawer.vue';
import EventCard from '../../components/Events/EventCard.vue';

const auth = useAuthStore();

const events = ref([]);
const drawerVisible = ref(false);
const editingEvent = ref(null);

const fetchEvents = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/events/schedule`, {
      params: { 
        venueId: auth.selectedVenue?._id
      },
      headers: { Authorization: `Bearer ${auth.token}` }
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
    await axios.delete(`${import.meta.env.VITE_API_URL}/events/schedule/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    message.success('Событие удалено');
    fetchEvents();
  } catch (error) {
    console.error('Error deleting event:', error);
    message.error('Не удалось удалить событие');
  }
};

const handleDrawerSubmit = async (formData) => {
  try {
    // Add venueId to the payload
    const payload = {
      ...formData,
      venueId: auth.selectedVenue?._id
    };
    
    if (formData._id) {
      await axios.put(`${import.meta.env.VITE_API_URL}/events/schedule/${formData._id}`, payload, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      message.success('Событие обновлено');
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/events/schedule`, payload, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
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
