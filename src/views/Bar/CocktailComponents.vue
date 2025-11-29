<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Компоненты</h1>
      <a-space>
        <router-link to="/categories">
          <a-button>Управление категориями</a-button>
        </router-link>
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          Добавить компонент
        </a-button>
      </a-space>
    </div>

    <!-- Список компонентов -->
    <a-row :gutter="[16, 16]">
      <a-col v-for="item in components" :key="item._id" :xs="24" :sm="12" :md="8">
        <a-badge-ribbon :text="item.category || 'Other'" :color="item.category === 'Alcohol' ? 'blue' : 'purple'" :style="{ top: '71px' }">
          <a-card class="h-full flex flex-col" :bodyStyle="{ flex: '1', display: 'flex', flexDirection: 'column' }">
            <template #extra>
              <a-dropdown trigger="click">
                <a class="ant-dropdown-link" @click.prevent>
                  <MoreOutlined style="font-size: 20px; cursor: pointer" />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="handleEdit(item)">
                      <EditOutlined /> Редактировать
                    </a-menu-item>
                    <a-menu-item danger>
                      <a-popconfirm
                        title="Удалить компонент?"
                        ok-text="Да"
                        cancel-text="Нет"
                        @confirm="deleteComponent(item._id)"
                      >
                        <span><DeleteOutlined /> Удалить</span>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
            <template #title>
              <router-link :to="`/components/${item._id}`" class="flex items-center gap-2">
                <span>{{ item.name }}</span>
              </router-link>
            </template>

            <div class="flex-1">
              <div class="mb-3">
                <img
                  :src="item.image || placeholderImage"
                  :alt="item.name"
                  class="w-full h-48 object-cover rounded"
                  @error="e => e.target.src = placeholderImage"
                />
              </div>
              
              <div class="text-sm text-gray-600 line-clamp-3">
                {{ item.description || 'Нет описания' }}
              </div>
            </div>
          </a-card>
        </a-badge-ribbon>
      </a-col>
    </a-row>

    <AddComponentDrawer
      v-model:open="showAddDrawer"
      :width="drawerWidth"
      :componentToEdit="editingComponent"
      @componentAdded="fetchComponents"
      @componentUpdated="fetchComponents"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { PlusOutlined, DeleteOutlined, MoreOutlined, EditOutlined } from "@ant-design/icons-vue";
import { COMPONENTS_URL } from '../../config/api.js';
import { useAuthStore } from '../../stores/auth';
import AddComponentDrawer from '../../components/Bar/AddComponentDrawer.vue';
import placeholderImage from '../../assets/cocktail_placeholder.png';

const components = ref([]);
const showAddDrawer = ref(false);
const drawerWidth = ref('600px');
const editingComponent = ref(null);

// Responsive drawer width
const updateDrawerWidth = () => {
  drawerWidth.value = window.innerWidth < 640 ? '100%' : '600px';
};

const handleAdd = () => {
  editingComponent.value = null;
  showAddDrawer.value = true;
};

const handleEdit = (item) => {
  editingComponent.value = item;
  showAddDrawer.value = true;
};

onMounted(() => {
  updateDrawerWidth();
  window.addEventListener('resize', updateDrawerWidth);
  fetchComponents();
});

onUnmounted(() => {
  window.removeEventListener('resize', updateDrawerWidth);
});

// === Загрузка списка ===
const fetchComponents = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;

  try {
    const res = await axios.get(COMPONENTS_URL, {
      params: { venueId: authStore.selectedVenue._id }
    });
    components.value = res.data;
  } catch (e) {
    console.error(e);
    message.error("Ошибка при загрузке компонентов");
  }
};

// === Удаление ===
const deleteComponent = async (id) => {
  try {
    await axios.delete(`${COMPONENTS_URL}/${id}`);
    message.success("Компонент удалён");
    await fetchComponents();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при удалении");
  }
};
</script>
