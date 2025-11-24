<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Методы приготовления</h1>
      <a-button type="primary" @click="handleAdd">
        <template #icon><PlusOutlined /></template>
        Добавить метод
      </a-button>
    </div>

    <!-- Список методов -->
    <a-row :gutter="[16, 16]">
      <a-col v-for="item in methods" :key="item._id" :xs="24" :sm="12" :md="8">
        <a-card class="h-full flex flex-col" hoverable>
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
                      title="Удалить метод?"
                      ok-text="Да"
                      cancel-text="Нет"
                      @confirm="deleteMethod(item._id)"
                    >
                      <span><DeleteOutlined /> Удалить</span>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <template #title>
            <span class="text-lg">{{ item.name }}</span>
          </template>
        </a-card>
      </a-col>
    </a-row>

    <AddMethodDrawer
      v-model:open="showAddDrawer"
      :width="drawerWidth"
      :methodToEdit="editingMethod"
      @methodAdded="fetchMethods"
      @methodUpdated="fetchMethods"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { PlusOutlined, DeleteOutlined, MoreOutlined, EditOutlined } from "@ant-design/icons-vue";
import { METHODS_URL } from '../config/api.js';
import { useAuthStore } from '../stores/auth';
import AddMethodDrawer from '../components/AddMethodDrawer.vue';

const methods = ref([]);
const showAddDrawer = ref(false);
const drawerWidth = ref('600px');
const editingMethod = ref(null);

// Responsive drawer width
const updateDrawerWidth = () => {
  drawerWidth.value = window.innerWidth < 640 ? '100%' : '600px';
};

const handleAdd = () => {
  editingMethod.value = null;
  showAddDrawer.value = true;
};

const handleEdit = (item) => {
  editingMethod.value = item;
  showAddDrawer.value = true;
};

onMounted(() => {
  updateDrawerWidth();
  window.addEventListener('resize', updateDrawerWidth);
  fetchMethods();
});

onUnmounted(() => {
  window.removeEventListener('resize', updateDrawerWidth);
});

// ===== Загрузка списка =====
const fetchMethods = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;

  try {
    const res = await axios.get(METHODS_URL, {
      params: { venueId: authStore.selectedVenue._id },
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    methods.value = res.data || [];
  } catch (e) {
    console.error(e);
    message.error("Не удалось загрузить методы");
  }
};

// ===== Удаление =====
const deleteMethod = async (id) => {
  const authStore = useAuthStore();
  try {
    await axios.delete(`${METHODS_URL}/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    message.success("Метод удалён");
    await fetchMethods();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при удалении метода");
  }
};
</script>
