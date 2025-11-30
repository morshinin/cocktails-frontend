<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Диджеи</h1>
      <a-button type="primary" @click="showDrawer">
        <template #icon><PlusOutlined /></template>
        Добавить DJ
      </a-button>
    </div>

    <a-row :gutter="[16, 16]">
      <a-col v-for="dj in djs" :key="dj._id" :xs="24" :sm="12" :md="8">
        <DJCard :dj="dj" @delete="deleteDJ" @edit="editDJ" />
      </a-col>
    </a-row>

    <AddDJDrawer
      v-model:visible="drawerVisible"
      :dj="editingDJ"
      @submit="handleDrawerSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import AddDJDrawer from '../../components/Events/AddDJDrawer.vue';
import DJCard from '../../components/Events/DJCard.vue';
import { DJS_URL } from '../../config/api.js';
import { useAuthStore } from '../../stores/auth';

const djs = ref([]);
const drawerVisible = ref(false);
const editingDJ = ref(null);

const fetchDJs = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;

  try {
    const response = await axios.get(DJS_URL, {
      params: { venueId: authStore.selectedVenue._id },
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    djs.value = response.data;
  } catch (error) {
    console.error('Error fetching DJs:', error);
    message.error('Не удалось загрузить список DJ');
  }
};

const showDrawer = () => {
  editingDJ.value = null;
  drawerVisible.value = true;
};

const editDJ = (dj) => {
  editingDJ.value = dj;
  drawerVisible.value = true;
};

const deleteDJ = async (id) => {
  const authStore = useAuthStore();
  try {
    await axios.delete(`${DJS_URL}/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    message.success('DJ удален');
    fetchDJs();
  } catch (error) {
    console.error('Error deleting DJ:', error);
    message.error('Не удалось удалить DJ');
  }
};

const handleDrawerSubmit = async (formData) => {
  const authStore = useAuthStore();
  try {
    if (formData._id) {
      await axios.put(`${DJS_URL}/${formData._id}`, formData, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success('DJ обновлен');
    } else {
      await axios.post(DJS_URL, {
        ...formData,
        venueId: authStore.selectedVenue._id
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success('DJ добавлен');
    }
    fetchDJs();
  } catch (error) {
    console.error('Error saving DJ:', error);
    message.error('Не удалось сохранить DJ');
  }
};

onMounted(() => {
  fetchDJs();
});
</script>
