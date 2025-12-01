<template>
  <div class="p-6 max-w-7xl mx-auto">
    <a-page-header
      title="🍽 Блюда"
      sub-title="Список рецептов"
      :breadcrumb="{ routes: [{ path: '/dishes', breadcrumbName: 'Блюда' }] }"
    >
      <template #extra>
        <a-button type="primary" @click="showAddDrawer = true">
          ➕ Добавить блюдо
        </a-button>
      </template>
    </a-page-header>

    <a-row :gutter="[16, 16]">
      <a-col v-for="dish in dishes" :key="dish._id" :xs="24" :sm="12" :md="8">
        <a-card hoverable class="h-full flex flex-col">
          <template #cover>
            <img
              :src="dish.image || placeholderImage"
              :alt="dish.name"
              class="h-48 object-cover"
              @error="e => e.target.src = placeholderImage"
            />
          </template>
          <a-card-meta :title="dish.name">
            <template #description>
              <div class="line-clamp-2">{{ dish.description }}</div>
              <div class="mt-2 font-bold text-lg">{{ dish.price ? `${dish.price} ₽` : '' }}</div>
            </template>
          </a-card-meta>
          <template #actions>
            <DeleteOutlined key="delete" @click="deleteDish(dish._id)" />
          </template>
        </a-card>
      </a-col>
    </a-row>

    <AddDishDrawer
      v-model:open="showAddDrawer"
      @dishAdded="fetchDishes"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { DeleteOutlined } from "@ant-design/icons-vue";
import { useAuthStore } from '../../stores/auth';
import AddDishDrawer from '../../components/Kitchen/AddDishDrawer.vue';
import placeholderImage from '../../assets/cocktail_placeholder.png';

const dishes = ref([]);
const showAddDrawer = ref(false);

const fetchDishes = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;
  
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const res = await axios.get(`${API_URL}/dishes`, {
      params: { venueId: authStore.selectedVenue._id }
    });
    dishes.value = res.data;
  } catch (e) {
    console.error(e);
    message.error("Ошибка при загрузке блюд");
  }
};

const deleteDish = async (id) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    await axios.delete(`${API_URL}/dishes/${id}`);
    message.success("Блюдо удалено");
    fetchDishes();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при удалении");
  }
};

onMounted(fetchDishes);
</script>
