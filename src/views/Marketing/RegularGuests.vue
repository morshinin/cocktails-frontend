<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">Постоянные гости</h1>
      <a-button type="primary" @click="showDrawer">
        <template #icon><PlusOutlined /></template>
        Добавить гостя
      </a-button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <a-card v-for="guest in guests" :key="guest._id" hoverable class="bg-gray-800 border-gray-700">
        <template #cover>
          <img 
            :alt="guest.name" 
            :src="guest.imageUrl || 'https://via.placeholder.com/300x300?text=No+Photo'" 
            class="h-64 object-cover"
          />
        </template>
        <template #actions>
          <EditOutlined key="edit" @click="editGuest(guest)" />
          <a-popconfirm title="Удалить гостя?" @confirm="deleteGuest(guest._id)">
            <DeleteOutlined key="delete" class="text-red-500" />
          </a-popconfirm>
        </template>
        <a-card-meta :title="guest.name">
          <template #description>
            <div class="text-gray-400 text-sm">
              <div v-if="guest.birthday" class="mb-1">🎂 {{ formatDate(guest.birthday) }}</div>
              <div v-if="guest.preferences" class="mb-1 line-clamp-2">❤️ {{ guest.preferences }}</div>
              <div class="flex gap-2 mt-2">
                <a v-if="guest.contacts?.telegram" :href="`https://t.me/${guest.contacts.telegram}`" target="_blank" class="text-blue-400"><SendOutlined /></a>
                <a v-if="guest.contacts?.phone" :href="`tel:${guest.contacts.phone}`" class="text-green-500"><PhoneOutlined /></a>
              </div>
            </div>
          </template>
        </a-card-meta>
      </a-card>
    </div>

    <AddRegularGuestDrawer
      v-model:visible="drawerVisible"
      :guest="editingGuest"
      @submit="handleDrawerSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { PlusOutlined, EditOutlined, DeleteOutlined, SendOutlined, PhoneOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import dayjs from 'dayjs';
import AddRegularGuestDrawer from '../../components/Marketing/AddRegularGuestDrawer.vue';
import { GUESTS_URL } from '../../config/api.js';
import { useAuthStore } from '../../stores/auth';

const guests = ref([]);
const drawerVisible = ref(false);
const editingGuest = ref(null);

const formatDate = (date) => {
  return dayjs(date).format('DD.MM.YYYY');
};

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
