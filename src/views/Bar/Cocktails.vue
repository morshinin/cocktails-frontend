<template>
  <div class="p-6 max-w-5xl mx-auto">
    <a-page-header
      title="🍸 Коктейли"
      sub-title="Список рецептов"
      :breadcrumb="{ routes: [{ path: '/cocktails', breadcrumbName: 'Коктейли' }] }"
    >
      <template #extra>
        <a-button type="primary" @click="showAddModal = true">
          ➕ Добавить коктейль
        </a-button>
      </template>
    </a-page-header>

    <AddCocktailDrawer
      v-model:visible="showAddModal"
      @success="fetchRecipes"
    />

    <CocktailFilter @filter="handleFilter" />
    
    <div class="mb-4 text-gray-600">
      {{ getCocktailCountText(filteredRecipes.length) }}
    </div>

    <a-row :gutter="[16, 16]">
      <a-col v-for="r in filteredRecipes" :key="r._id" :xs="24" :sm="12" :md="8">
        <CocktailCard :recipe="r" @delete="deleteRecipe" />
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { message } from "ant-design-vue"
import CocktailFilter from "../../components/Bar/CocktailFilter.vue"
import CocktailCard from "../../components/Bar/CocktailCard.vue"
import AddCocktailDrawer from "../../components/Bar/AddCocktailDrawer.vue"
import { RECIPES_URL } from '../../config/api.js';
import { useAuthStore } from '../../stores/auth';

const recipes = ref([])
const showAddModal = ref(false)
const filteredRecipes = ref([])

const fetchRecipes = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;
  
  const res = await axios.get(RECIPES_URL, {
    params: { venueId: authStore.selectedVenue._id }
  })
  recipes.value = res.data
  filteredRecipes.value = res.data
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
    return matchCategory && matchComponent && matchGlass && matchMethod && matchDecoration
  })
}

const getCocktailCountText = (count) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count} коктейлей`;
  }

  if (lastDigit === 1) {
    return `${count} коктейль`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} коктейля`;
  }

  return `${count} коктейлей`;
}

const deleteRecipe = async (id) => {
  await axios.delete(`${RECIPES_URL}/${id}`)
  message.info("Коктейль удалён")
  await fetchRecipes()
}

onMounted(fetchRecipes)
</script>


