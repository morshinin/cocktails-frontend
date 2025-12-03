<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Аллергены</h1>
      <a-button type="primary" @click="handleAdd">
        <template #icon><PlusOutlined /></template>
        Добавить аллерген
      </a-button>
    </div>

    <!-- Список аллергенов -->
    <div v-if="loading" class="text-center py-12">
      <a-spin size="large" />
    </div>

    <a-row v-else :gutter="[16, 16]">
      <a-col v-for="item in allergens" :key="item._id" :xs="24" :sm="12" :md="8">
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
                      title="Удалить аллерген?"
                      ok-text="Да"
                      cancel-text="Нет"
                      @confirm="deleteAllergen(item._id)"
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

    <AddAllergenDrawer
      v-model:open="showAddDrawer"
      :width="drawerWidth"
      :allergenToEdit="editingAllergen"
      :apiUrl="ALLERGENS_URL"
      @allergenAdded="fetchAllergens"
      @allergenUpdated="fetchAllergens"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { PlusOutlined, DeleteOutlined, MoreOutlined, EditOutlined } from "@ant-design/icons-vue";
import { ALLERGENS_URL } from '../../config/api.js';
import { useAuthStore } from '../../stores/auth';
import AddAllergenDrawer from '../../components/Kitchen/AddAllergenDrawer.vue';

const allergens = ref([]);
const showAddDrawer = ref(false);
const drawerWidth = ref('600px');
const editingAllergen = ref(null);
const loading = ref(false);

// Responsive drawer width
const updateDrawerWidth = () => {
  drawerWidth.value = window.innerWidth < 640 ? '100%' : '600px';
};

const handleAdd = () => {
  editingAllergen.value = null;
  showAddDrawer.value = true;
};

const handleEdit = (item) => {
  editingAllergen.value = item;
  showAddDrawer.value = true;
};

onMounted(() => {
  updateDrawerWidth();
  window.addEventListener('resize', updateDrawerWidth);
  fetchAllergens();
});

onUnmounted(() => {
  window.removeEventListener('resize', updateDrawerWidth);
});

// ===== Загрузка списка =====
const fetchAllergens = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;

  loading.value = true;
  try {
    const res = await axios.get(ALLERGENS_URL, {
      params: { venueId: authStore.selectedVenue._id },
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    allergens.value = res.data || [];
  } catch (e) {
    console.error(e);
    message.error("Не удалось загрузить аллергены");
  } finally {
    loading.value = false;
  }
};

// ===== Удаление =====
const deleteAllergen = async (id) => {
  const authStore = useAuthStore();
  try {
    await axios.delete(`${ALLERGENS_URL}/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    message.success("Аллерген удалён");
    await fetchAllergens();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при удалении аллергена");
  }
};
</script>
