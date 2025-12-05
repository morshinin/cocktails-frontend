<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Блюда</h1>
      <a-space>
        <router-link to="/dish-categories">
          <a-button>Управление категориями</a-button>
        </router-link>
        <a-button type="primary" @click="showAddDrawer = true">
          <template #icon><PlusOutlined /></template>
          Добавить блюдо
        </a-button>
      </a-space>
    </div>

    <SearchAndSort
      :item-count="filteredDishes.length"
      v-model:search-value="searchQuery"
      :sort-order="sortOrder"
      item-type="dish"
      @search="handleSearch"
      @sort="sortDishes"
    />

    <a-row :gutter="[16, 16]">
      <a-col v-for="dish in filteredDishes" :key="dish._id" :xs="24" :sm="12" :md="8">
        <DishCard 
          :dish="dish" 
          @delete="deleteDish"
          @edit="handleEdit"
        />
      </a-col>
    </a-row>

    <AddDishDrawer
      v-model:open="showAddDrawer"
      :dishToEdit="editingDish"
      @dishAdded="fetchDishes"
      @dishUpdated="fetchDishes"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { useAuthStore } from '../../stores/auth';
import AddDishDrawer from '../../components/Kitchen/AddDishDrawer.vue';
import DishCard from '../../components/Kitchen/DishCard.vue';
import SearchAndSort from '../../components/Common/SearchAndSort.vue';

const dishes = ref([]);
const filteredDishes = ref([]);
const showAddDrawer = ref(false);
const editingDish = ref(null);
const searchQuery = ref('');
const sortOrder = ref(null);

const handleEdit = (dish) => {
  editingDish.value = dish;
  showAddDrawer.value = true;
};

const fetchDishes = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;
  
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const res = await axios.get(`${API_URL}/dishes`, {
      params: { venueId: authStore.selectedVenue._id }
    });
    dishes.value = res.data;
    filteredDishes.value = res.data;
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

const handleSearch = () => {
  filteredDishes.value = dishes.value.filter((d) => {
    const matchSearch = !searchQuery.value || d.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchSearch
  })
  
  if (sortOrder.value) {
    sortDishes(sortOrder.value)
  }
}

const sortDishes = (order) => {
  sortOrder.value = order;
  filteredDishes.value = [...filteredDishes.value].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    
    if (order === 'asc') {
      return nameA.localeCompare(nameB, 'ru');
    } else {
      return nameB.localeCompare(nameA, 'ru');
    }
  });
};

onMounted(fetchDishes);
</script>
