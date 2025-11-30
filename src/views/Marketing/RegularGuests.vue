<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Постоянные гости</h1>
      <a-button type="primary" @click="showDrawer">
        <template #icon><PlusOutlined /></template>
        Добавить гостя
      </a-button>
    </div>

    <a-row :gutter="[16, 16]">
      <a-col v-for="guest in guests" :key="guest._id" :xs="24" :sm="12" :md="8">
        <RegularGuestCard :guest="guest" @delete="deleteGuest" @edit="editGuest" />
      </a-col>
    </a-row>

    <AddRegularGuestDrawer
      v-model:visible="drawerVisible"
      :guest="editingGuest"
      @submit="handleDrawerSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import AddRegularGuestDrawer from '../../components/Marketing/AddRegularGuestDrawer.vue';
import RegularGuestCard from '../../components/Marketing/RegularGuestCard.vue';
import { GUESTS_URL } from '../../config/api.js';
import { useAuthStore } from '../../stores/auth';

const guests = ref([]);
const drawerVisible = ref(false);
const editingGuest = ref(null);


const fetchGuests = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;

  try {
    const response = await axios.get(GUESTS_URL, {
      params: { venueId: authStore.selectedVenue._id },
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    guests.value = response.data;
  } catch (error) {
    console.error('Error fetching guests:', error);
    message.error('Не удалось загрузить список гостей');
  }
};

const showDrawer = () => {
  editingGuest.value = null;
  drawerVisible.value = true;
};

const editGuest = (guest) => {
  editingGuest.value = guest;
  drawerVisible.value = true;
};

const deleteGuest = async (id) => {
  const authStore = useAuthStore();
  try {
    await axios.delete(`${GUESTS_URL}/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    message.success('Гость удален');
    fetchGuests();
  } catch (error) {
    console.error('Error deleting guest:', error);
    message.error('Не удалось удалить гостя');
  }
};

const handleDrawerSubmit = async (formData) => {
  const authStore = useAuthStore();
  try {
    if (formData._id) {
      await axios.put(`${GUESTS_URL}/${formData._id}`, formData, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success('Гость обновлен');
    } else {
      await axios.post(GUESTS_URL, {
        ...formData,
        venueId: authStore.selectedVenue._id
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success('Гость добавлен');
    }
    fetchGuests();
  } catch (error) {
    console.error('Error saving guest:', error);
    message.error('Не удалось сохранить гостя');
  }
};

onMounted(() => {
  fetchGuests();
});
</script>
