<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">👕 Мерч</h1>
      <a-button type="primary" @click="showDrawer = true">
        <template #icon><PlusOutlined /></template>
        Добавить мерч
      </a-button>
    </div>

    <a-row :gutter="[16, 16]">
      <a-col v-for="item in merch" :key="item._id" :xs="24" :sm="12" :md="8">
        <MerchCard :item="item" @delete="deleteMerch" @edit="editMerch" />
      </a-col>
    </a-row>

    <AddMerchItemDrawer
      v-model:visible="drawerVisible"
      :merch="editingMerch"
      @submit="handleDrawerSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import AddMerchItemDrawer from '../../components/Marketing/AddMerchItemDrawer.vue';
import MerchCard from '../../components/Marketing/MerchCard.vue';
import { MERCH_URL } from '../../config/api.js';
import { useAuthStore } from '../../stores/auth';

const merch = ref([]);
const drawerVisible = ref(false);
const editingMerch = ref(null);

const fetchMerch = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;

  try {
    const response = await axios.get(MERCH_URL, {
      params: { venueId: authStore.selectedVenue._id },
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    merch.value = response.data;
  } catch (error) {
    console.error('Error fetching merch:', error);
    message.error('Не удалось загрузить список товаров');
  }
};

const showDrawer = () => {
  editingMerch.value = null;
  drawerVisible.value = true;
};

const editMerch = (item) => {
  editingMerch.value = item;
  drawerVisible.value = true;
};

const deleteMerch = async (id) => {
  const authStore = useAuthStore();
  try {
    await axios.delete(`${MERCH_URL}/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    message.success('Товар удален');
    fetchMerch();
  } catch (error) {
    console.error('Error deleting merch:', error);
    message.error('Не удалось удалить товар');
  }
};

const handleDrawerSubmit = async (formData) => {
  const authStore = useAuthStore();
  try {
    if (formData._id) {
      await axios.put(`${MERCH_URL}/${formData._id}`, formData, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success('Товар обновлен');
    } else {
      await axios.post(MERCH_URL, {
        ...formData,
        venueId: authStore.selectedVenue._id
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success('Товар добавлен');
    }
    fetchMerch();
  } catch (error) {
    console.error('Error saving merch:', error);
    message.error('Не удалось сохранить товар');
  }
};

onMounted(() => {
  fetchMerch();
});
</script>
