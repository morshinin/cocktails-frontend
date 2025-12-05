<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">🍸 Коктейли</h1>
      <a-button type="primary" @click="showAddModal = true">
        ➕ Добавить коктейль
      </a-button>
    </div>

    <AddCocktailDrawer
      v-model:visible="showAddModal"
      @success="fetchRecipes"
    />

    <div v-if="loading" class="text-center py-12">
      <a-spin size="large" />
    </div>

    <div v-else>
      <CocktailFilter @filter="handleFilter" />
      
      <SearchAndSort
        :item-count="filteredRecipes.length"
        v-model:search-value="searchQuery"
        :sort-order="sortOrder"
        item-type="cocktail"
        @search="handleSearch"
        @sort="sortCocktails"
      />

      <a-row :gutter="[16, 16]">
        <a-col v-for="r in filteredRecipes" :key="r._id" :xs="24" :sm="12" :md="8">
          <CocktailCard :recipe="r" @delete="deleteRecipe" />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { message } from "ant-design-vue"
import CocktailFilter from "../../components/Bar/CocktailFilter.vue"
import CocktailCard from "../../components/Bar/CocktailCard.vue"
import AddCocktailDrawer from "../../components/Bar/AddCocktailDrawer.vue"
import SearchAndSort from "../../components/Common/SearchAndSort.vue"
import { RECIPES_URL } from '../../config/api.js';
import { useAuthStore } from '../../stores/auth';

const recipes = ref([])
const showAddModal = ref(false)
const filteredRecipes = ref([])
const loading = ref(false)
const sortOrder = ref(null)
const searchQuery = ref('')

const fetchRecipes = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;
  
  loading.value = true;
  try {
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 500));
    const [res] = await Promise.all([
      axios.get(RECIPES_URL, {
        params: { venueId: authStore.selectedVenue._id },
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      minLoadTime
    ]);
    recipes.value = res.data
    filteredRecipes.value = res.data
  } catch (e) {
    console.error(e);
    message.error("Не удалось загрузить коктейли");
  } finally {
    loading.value = false;
  }
}

const handleFilter = (filters) => {
  filteredRecipes.value = recipes.value.filter((r) => {
    const matchCategory = !filters.category || r.category === filters.category
    const matchComponent =
      !filters.component ||
      r.components.some((c) => c.name === filters.component)
    const matchGlass = !filters.glass || r.glass === filters.glass
    const matchMethod = !filters.method || (Array.isArray(r.method) ? r.method.includes(filters.method) : r.method === filters.method)
    const matchDecoration = !filters.decoration || (Array.isArray(r.decoration) ? r.decoration.includes(filters.decoration) : r.decoration === filters.decoration)
    const matchSearch = !searchQuery.value || r.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCategory && matchComponent && matchGlass && matchMethod && matchDecoration && matchSearch
  })
  
  // Reapply current sort if active
  if (sortOrder.value) {
    sortCocktails(sortOrder.value)
  }
}

const handleSearch = () => {
  filteredRecipes.value = recipes.value.filter((r) => {
    const matchSearch = !searchQuery.value || r.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchSearch
  })
  
  // Reapply current sort if active
  if (sortOrder.value) {
    sortCocktails(sortOrder.value)
  }
}


const sortCocktails = (order) => {
  sortOrder.value = order;
  filteredRecipes.value = [...filteredRecipes.value].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    
    if (order === 'asc') {
      return nameA.localeCompare(nameB, 'ru');
    } else {
      return nameB.localeCompare(nameA, 'ru');
    }
  });
}


const deleteRecipe = async (id) => {
  const authStore = useAuthStore();
  try {
    await axios.delete(`${RECIPES_URL}/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    message.info("Коктейль удалён")
    await fetchRecipes()
  } catch (e) {
    console.error(e);
    message.error("Ошибка при удалении");
  }
}

onMounted(fetchRecipes)
</script>


