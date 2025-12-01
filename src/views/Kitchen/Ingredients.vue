<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Ингредиенты</h1>
      <a-button type="primary" @click="showAddDrawer = true">
        <template #icon><PlusOutlined /></template>
        Добавить ингредиент
      </a-button>
    </div>

    <a-row :gutter="[16, 16]">
      <a-col v-for="item in ingredients" :key="item._id" :xs="24" :sm="12" :md="8">
        <a-card hoverable class="h-full flex flex-col">
          <template #cover>
            <img
              :src="item.image || placeholderImage"
              :alt="item.name"
              class="h-48 object-cover"
              @error="e => e.target.src = placeholderImage"
            />
          </template>
          <a-card-meta :title="item.name">
            <template #description>
              <div class="line-clamp-2">{{ item.description }}</div>
              <div class="mt-1 text-xs text-gray-500">{{ item.category }}</div>
            </template>
          </a-card-meta>
          <template #actions>
            <DeleteOutlined key="delete" @click="deleteIngredient(item._id)" />
          </template>
        </a-card>
      </a-col>
    </a-row>

    <AddIngredientDrawer
      v-model:open="showAddDrawer"
      @ingredientAdded="fetchIngredients"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { useAuthStore } from '../../stores/auth';
import AddIngredientDrawer from '../../components/Kitchen/AddIngredientDrawer.vue';
import placeholderImage from '../../assets/cocktail_placeholder.png';

const ingredients = ref([]);
const showAddDrawer = ref(false);

const fetchIngredients = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;
  
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const res = await axios.get(`${API_URL}/ingredients`, {
      params: { venueId: authStore.selectedVenue._id }
    });
    ingredients.value = res.data;
  } catch (e) {
    console.error(e);
    message.error("Ошибка при загрузке ингредиентов");
  }
};

const deleteIngredient = async (id) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    await axios.delete(`${API_URL}/ingredients/${id}`);
    message.success("Ингредиент удален");
    fetchIngredients();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при удалении");
  }
};

onMounted(fetchIngredients);
</script>
