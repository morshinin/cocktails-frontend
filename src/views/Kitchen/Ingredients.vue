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
        <IngredientCard 
          :ingredient="item" 
          @delete="deleteIngredient"
          @edit="handleEdit"
        />
      </a-col>
    </a-row>

    <AddIngredientDrawer
      v-model:open="showAddDrawer"
      :ingredientToEdit="editingIngredient"
      @ingredientAdded="fetchIngredients"
      @ingredientUpdated="fetchIngredients"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { useAuthStore } from '../../stores/auth';
import AddIngredientDrawer from '../../components/Kitchen/AddIngredientDrawer.vue';
import IngredientCard from '../../components/Kitchen/IngredientCard.vue';

const ingredients = ref([]);
const showAddDrawer = ref(false);
const editingIngredient = ref(null);

const handleEdit = (ingredient) => {
  editingIngredient.value = ingredient;
  showAddDrawer.value = true;
};

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
