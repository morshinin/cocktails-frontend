<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">Диджеи</h1>
      <a-button type="primary" @click="showDrawer">
        <template #icon><PlusOutlined /></template>
        Добавить DJ
      </a-button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <a-card v-for="dj in djs" :key="dj._id" hoverable class="bg-gray-800 border-gray-700">
        <template #cover>
          <img 
            :alt="dj.name" 
            :src="dj.imageUrl || 'https://via.placeholder.com/300x300?text=No+Photo'" 
            class="h-64 object-cover"
          />
        </template>
        <template #actions>
          <EditOutlined key="edit" @click="editDJ(dj)" />
          <a-popconfirm title="Удалить DJ?" @confirm="deleteDJ(dj._id)">
            <DeleteOutlined key="delete" class="text-red-500" />
          </a-popconfirm>
        </template>
        <a-card-meta :title="dj.name" :description="dj.genre">
          <template #avatar>
            <a-avatar :src="dj.imageUrl" />
          </template>
        </a-card-meta>
        <div class="mt-4 text-gray-400 text-sm line-clamp-3">
          {{ dj.description }}
        </div>
        <div class="mt-4 flex gap-2">
          <a v-if="dj.socialLinks?.instagram" :href="`https://instagram.com/${dj.socialLinks.instagram}`" target="_blank" class="text-pink-500"><InstagramOutlined /></a>
          <a v-if="dj.socialLinks?.soundcloud" :href="dj.socialLinks.soundcloud" target="_blank" class="text-orange-500"><SoundOutlined /></a>
          <a v-if="dj.socialLinks?.telegram" :href="`https://t.me/${dj.socialLinks.telegram}`" target="_blank" class="text-blue-400"><SendOutlined /></a>
        </div>
      </a-card>
    </div>

    <AddDJDrawer
      v-model:visible="drawerVisible"
      :dj="editingDJ"
      @submit="handleDrawerSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { PlusOutlined, EditOutlined, DeleteOutlined, InstagramOutlined, SoundOutlined, SendOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import AddDJDrawer from '../../components/Events/AddDJDrawer.vue';

const djs = ref([]);
const drawerVisible = ref(false);
const editingDJ = ref(null);

const fetchDJs = async () => {
  try {
    const response = await axios.get('/api/events/djs');
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
  try {
    await axios.delete(`/api/events/djs/${id}`);
    message.success('DJ удален');
    fetchDJs();
  } catch (error) {
    console.error('Error deleting DJ:', error);
    message.error('Не удалось удалить DJ');
  }
};

const handleDrawerSubmit = async (formData) => {
  try {
    if (formData._id) {
      await axios.put(`/api/events/djs/${formData._id}`, formData);
      message.success('DJ обновлен');
    } else {
      await axios.post('/api/events/djs', formData);
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
