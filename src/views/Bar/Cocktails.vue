<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Коктейли</h1>
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
      <SearchAndSort
        :item-count="filteredRecipes.length"
        v-model:search-value="searchQuery"
        :sort-order="sortOrder"
        item-type="cocktail"
        @search="handleSearch"
        @sort="sortCocktails"
      >
        <template #filters>
          <div class="flex flex-wrap gap-4">
            <!-- Фильтр по категории -->
            <a-select
              v-model:value="filters.category"
              placeholder="Категория"
              style="min-width: 150px"
              allow-clear
            >
              <a-select-option value="Classic">Classic</a-select-option>
              <a-select-option value="Signature">Signature</a-select-option>
            </a-select>

            <!-- Фильтр по компоненту -->
            <a-select
              v-model:value="filters.component"
              placeholder="Ингредиент"
              style="min-width: 150px"
              allow-clear
            >
              <a-select-option
                v-for="c in components"
                :key="c._id"
                :value="c.name"
              >
                {{ c.name }}
              </a-select-option>
            </a-select>

            <!-- Фильтр по бокалу -->
            <a-select
              v-model:value="filters.glass"
              placeholder="Бокал"
              style="min-width: 150px"
              allow-clear
            >
              <a-select-option
                v-for="g in glasses"
                :key="g._id"
                :value="g.name"
              >
                {{ g.name }}
              </a-select-option>
            </a-select>

            <!-- Фильтр по методу -->
            <a-select
              v-model:value="filters.method"
              placeholder="Метод"
              style="min-width: 150px"
              allow-clear
            >
              <a-select-option
                v-for="m in methods"
                :key="m._id"
                :value="m.name"
              >
                {{ m.name }}
              </a-select-option>
            </a-select>

            <!-- Фильтр по украшению -->
            <a-select
              v-model:value="filters.decoration"
              placeholder="Украшение"
              style="min-width: 150px"
              allow-clear
            >
              <a-select-option
                v-for="d in decorations"
                :key="d._id"
                :value="d.name"
              >
                {{ d.name }}
              </a-select-option>
            </a-select>

            <!-- Кнопка сброса -->
            <a-button @click="resetFilters">Сбросить</a-button>
          </div>
        </template>
      </SearchAndSort>

      <a-row :gutter="[16, 16]">
        <a-col v-for="r in filteredRecipes" :key="r._id" :xs="24" :sm="12" :md="8">
          <CocktailCard :recipe="r" @delete="deleteRecipe" />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import axios from "axios"
import { message } from "ant-design-vue"
import CocktailCard from "../../components/Bar/CocktailCard.vue"
import AddCocktailDrawer from "../../components/Bar/AddCocktailDrawer.vue"
import SearchAndSort from "../../components/Common/SearchAndSort.vue"
import { RECIPES_URL, COMPONENTS_URL, METHODS_URL, GLASSES_URL, DECORATIONS_URL } from '../../config/api.js';
import { useAuthStore } from '../../stores/auth';

const recipes = ref([])
const showAddModal = ref(false)
const filteredRecipes = ref([])
const loading = ref(false)
const sortOrder = ref(null)
const searchQuery = ref('')

// Filter data
const filters = ref({
  category: undefined,
  component: undefined,
  glass: undefined,
  method: undefined,
  decoration: undefined,
})

const components = ref([])
const glasses = ref([])
const methods = ref([])
const decorations = ref([])

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

// Fetch filter data
const fetchFilterData = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;

  try {
    const [compRes, glassRes, methodRes, decorationRes] = await Promise.all([
      axios.get(COMPONENTS_URL, { params: { venueId: authStore.selectedVenue._id } }),
      axios.get(GLASSES_URL, { 
        params: { venueId: authStore.selectedVenue._id },
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      axios.get(METHODS_URL, { 
        params: { venueId: authStore.selectedVenue._id },
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      axios.get(DECORATIONS_URL, { 
        params: { venueId: authStore.selectedVenue._id },
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
    ])
    components.value = compRes.data || []
    glasses.value = glassRes.data || []
    methods.value = methodRes.data || []
    decorations.value = decorationRes.data || []
  } catch (err) {
    console.error("Ошибка при загрузке данных фильтра:", err)
    message.error("Не удалось загрузить данные фильтра")
  }
}

const handleFilter = () => {
  filteredRecipes.value = recipes.value.filter((r) => {
    const matchCategory = !filters.value.category || r.category === filters.value.category
    const matchComponent =
      !filters.value.component ||
      r.components.some((c) => c.name === filters.value.component)
    const matchGlass = !filters.value.glass || r.glass === filters.value.glass
    const matchMethod = !filters.value.method || (Array.isArray(r.method) ? r.method.includes(filters.value.method) : r.method === filters.value.method)
    const matchDecoration = !filters.value.decoration || (Array.isArray(r.decoration) ? r.decoration.includes(filters.value.decoration) : r.decoration === filters.value.decoration)
    const matchSearch = !searchQuery.value || r.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCategory && matchComponent && matchGlass && matchMethod && matchDecoration && matchSearch
  })
  
  // Reapply current sort if active
  if (sortOrder.value) {
    sortCocktails(sortOrder.value)
  }
}

const handleSearch = () => {
  handleFilter()
}

const resetFilters = () => {
  filters.value = { category: undefined, component: undefined, glass: undefined, method: undefined, decoration: undefined }
}

// Watch filters for automatic application
watch(filters, () => {
  handleFilter()
}, { deep: true })

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

onMounted(() => {
  fetchRecipes()
  fetchFilterData()
})
</script>


