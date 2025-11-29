<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">Потеряшки</h1>
      <a-button type="primary" @click="showDrawer">
        <template #icon><PlusOutlined /></template>
        Добавить запись
      </a-button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in items" :key="item._id" class="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 flex flex-col">
        <div class="h-48 bg-gray-700 relative">
          <img 
            v-if="item.imageUrl" 
            :src="item.imageUrl" 
            alt="Item" 
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
            <span class="text-4xl">📷</span>
          </div>
          <div class="absolute top-2 right-2">
            <a-tag :color="item.status === 'Returned' ? 'green' : 'orange'">
              {{ item.status === 'Returned' ? 'Возвращена' : 'Ожидает' }}
            </a-tag>
          </div>
        </div>
        
        <div class="p-4 flex-1 flex flex-col">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-xl font-semibold text-white">{{ item.name }}</h3>
            <a-dropdown>
              <a class="ant-dropdown-link" @click.prevent>
                <MoreOutlined class="text-xl text-gray-400" />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="editItem(item)">Редактировать</a-menu-item>
                  <a-menu-item danger @click="deleteItem(item._id)">Удалить</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          
          <p class="text-gray-400 text-sm mb-4 flex-1">{{ item.description || 'Нет описания' }}</p>
          
          <div class="border-t border-gray-700 pt-4 text-sm text-gray-400">
            <div class="flex justify-between mb-1">
              <span>Дата:</span>
              <span>{{ new Date(item.dateFound).toLocaleDateString() }}</span>
            </div>
            <div class="flex justify-between mb-1" v-if="item.finderName">
              <span>Нашел:</span>
              <span>{{ item.finderName }}</span>
            </div>
            <div class="flex justify-between" v-if="item.ownerContact">
              <span>Владелец:</span>
              <span>{{ item.ownerContact }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AddLostItemDrawer
      v-model:visible="drawerVisible"
      :item="editingItem"
      @submit="handleDrawerSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { PlusOutlined, MoreOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import AddLostItemDrawer from '../../components/housekeeping/AddLostItemDrawer.vue';

const items = ref([]);
const drawerVisible = ref(false);
const editingItem = ref(null);

const fetchItems = async () => {
  try {
    const response = await axios.get('/api/housekeeping/lost-items');
    items.value = response.data;
  } catch (error) {
    console.error('Error fetching lost items:', error);
    message.error('Не удалось загрузить список');
  }
};

const showDrawer = () => {
  editingItem.value = null;
  drawerVisible.value = true;
};

const editItem = (item) => {
  editingItem.value = item;
  drawerVisible.value = true;
};

const deleteItem = async (id) => {
  try {
    await axios.delete(`/api/housekeeping/lost-items/${id}`);
    message.success('Запись удалена');
    fetchItems();
  } catch (error) {
    console.error('Error deleting item:', error);
    message.error('Не удалось удалить запись');
  }
};

const handleDrawerSubmit = async (formData) => {
  try {
    if (formData._id) {
      await axios.put(`/api/housekeeping/lost-items/${formData._id}`, formData);
      message.success('Запись обновлена');
    } else {
      await axios.post('/api/housekeeping/lost-items', formData);
      message.success('Запись создана');
    }
    fetchItems();
  } catch (error) {
    console.error('Error saving item:', error);
    message.error('Не удалось сохранить запись');
  }
};

onMounted(() => {
  fetchItems();
});
</script>
