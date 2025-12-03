<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Зоны</h1>
      <a-button type="primary" @click="showDrawer = true">
        <template #icon><PlusOutlined /></template>
        Добавить зону
      </a-button>
    </div>

    <a-row :gutter="[16, 16]">
      <a-col v-for="zone in zones" :key="zone._id" :xs="24" :sm="12" :md="8">
        <ZoneCard :zone="zone" @delete="deleteZone" @edit="editZone" />
      </a-col>
    </a-row>

    <AddZoneDrawer
      v-model:visible="drawerVisible"
      :zone="editingZone"
      @submit="handleDrawerSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import AddZoneDrawer from '../../components/Housekeeping/AddZoneDrawer.vue';
import ZoneCard from '../../components/Housekeeping/ZoneCard.vue';
import { ZONES_URL } from '../../config/api.js';
import { useAuthStore } from '../../stores/auth';

const zones = ref([]);
const drawerVisible = ref(false);
const editingZone = ref(null);

const fetchZones = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;

  try {
    const response = await axios.get(ZONES_URL, {
      params: { venueId: authStore.selectedVenue._id },
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    zones.value = response.data;
  } catch (error) {
    console.error('Error fetching zones:', error);
    message.error('Не удалось загрузить зоны');
  }
};

const showDrawer = () => {
  editingZone.value = null;
  drawerVisible.value = true;
};

const editZone = (zone) => {
  editingZone.value = zone;
  drawerVisible.value = true;
};

const deleteZone = async (id) => {
  const authStore = useAuthStore();
  try {
    await axios.delete(`${ZONES_URL}/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    message.success('Зона удалена');
    fetchZones();
  } catch (error) {
    console.error('Error deleting zone:', error);
    message.error('Не удалось удалить зону');
  }
};

const handleDrawerSubmit = async (formData) => {
  const authStore = useAuthStore();
  try {
    if (formData._id) {
      await axios.put(`${ZONES_URL}/${formData._id}`, formData, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success('Зона обновлена');
    } else {
      await axios.post(ZONES_URL, {
        ...formData,
        venueId: authStore.selectedVenue._id
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success('Зона создана');
    }
    fetchZones();
  } catch (error) {
    console.error('Error saving zone:', error);
    message.error('Не удалось сохранить зону');
  }
};

onMounted(() => {
  fetchZones();
});
</script>
