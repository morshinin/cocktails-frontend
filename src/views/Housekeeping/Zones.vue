<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">Зоны</h1>
      <a-button type="primary" @click="showDrawer">
        <template #icon><PlusOutlined /></template>
        Добавить зону
      </a-button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="zone in zones" :key="zone._id" class="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-semibold text-white">{{ zone.name }}</h3>
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              <MoreOutlined class="text-xl text-gray-400" />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="editZone(zone)">Редактировать</a-menu-item>
                <a-menu-item danger @click="deleteZone(zone._id)">Удалить</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <p class="text-gray-400">{{ zone.description || 'Нет описания' }}</p>
      </div>
    </div>

    <AddZoneDrawer
      v-model:visible="drawerVisible"
      :zone="editingZone"
      @submit="handleDrawerSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { PlusOutlined, MoreOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import AddZoneDrawer from '../../components/Housekeeping/AddZoneDrawer.vue';

const zones = ref([]);
const drawerVisible = ref(false);
const editingZone = ref(null);

const fetchZones = async () => {
  try {
    const response = await axios.get('/api/housekeeping/zones');
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
  try {
    await axios.delete(`/api/housekeeping/zones/${id}`);
    message.success('Зона удалена');
    fetchZones();
  } catch (error) {
    console.error('Error deleting zone:', error);
    message.error('Не удалось удалить зону');
  }
};

const handleDrawerSubmit = async (formData) => {
  try {
    if (formData._id) {
      await axios.put(`/api/housekeeping/zones/${formData._id}`, formData);
      message.success('Зона обновлена');
    } else {
      await axios.post('/api/housekeeping/zones', formData);
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
