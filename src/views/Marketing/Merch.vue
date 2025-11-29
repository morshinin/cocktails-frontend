<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">Мерч</h1>
      <a-button type="primary" @click="showDrawer">
        <template #icon><PlusOutlined /></template>
        Добавить товар
      </a-button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <a-card v-for="item in merch" :key="item._id" hoverable class="bg-gray-800 border-gray-700">
        <template #cover>
          <img 
            :alt="item.name" 
            :src="item.imageUrl || 'https://via.placeholder.com/300x300?text=No+Photo'" 
            class="h-64 object-cover"
          />
        </template>
        <template #actions>
          <EditOutlined key="edit" @click="editMerch(item)" />
          <a-popconfirm title="Удалить товар?" @confirm="deleteMerch(item._id)">
            <DeleteOutlined key="delete" class="text-red-500" />
          </a-popconfirm>
        </template>
        <a-card-meta :title="item.name">
          <template #description>
            <div class="text-gray-400 text-sm">
              <div class="font-bold text-lg text-white mb-2">₽ {{ item.price }}</div>
              <div class="mb-2 line-clamp-2">{{ item.description }}</div>
              <a-tag :color="item.stock > 0 ? 'green' : 'red'">
                {{ item.stock > 0 ? `В наличии: ${item.stock}` : 'Нет в наличии' }}
              </a-tag>
            </div>
          </template>
        </a-card-meta>
      </a-card>
    </div>

    <AddMerchItemDrawer
      v-model:visible="drawerVisible"
      :merch="editingMerch"
      @submit="handleDrawerSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import AddMerchItemDrawer from '../../components/Marketing/AddMerchItemDrawer.vue';

const merch = ref([]);
const drawerVisible = ref(false);
const editingMerch = ref(null);

const fetchMerch = async () => {
  try {
    const response = await axios.get('/api/marketing/merch');
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
  try {
    await axios.delete(`/api/marketing/merch/${id}`);
    message.success('Товар удален');
    fetchMerch();
  } catch (error) {
    console.error('Error deleting merch:', error);
    message.error('Не удалось удалить товар');
  }
};

const handleDrawerSubmit = async (formData) => {
  try {
    if (formData._id) {
      await axios.put(`/api/marketing/merch/${formData._id}`, formData);
      message.success('Товар обновлен');
    } else {
      await axios.post('/api/marketing/merch', formData);
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
