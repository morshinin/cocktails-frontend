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
            <a-select-option
              v-for="cat in dishCategories"
              :key="cat._id"
              :value="cat.name"
            >
              {{ cat.name }}
            </a-select-option>
          </a-select>

          <!-- Фильтр по методу -->
          <a-select
            v-model:value="filters.method"
            placeholder="Метод приготовления"
            style="min-width: 180px"
            allow-clear
          >
            <a-select-option
              v-for="m in kitchenMethods"
              :key="m._id"
              :value="m.name"
            >
              {{ m.name }}
            </a-select-option>
          </a-select>

          <!-- Фильтр по аллергенам -->
          <a-select
            v-model:value="filters.allergen"
            placeholder="Аллерген"
            style="min-width: 150px"
            allow-clear
          >
            <a-select-option
              v-for="a in allergens"
              :key="a._id"
              :value="a.name"
            >
              {{ a.name }}
            </a-select-option>
          </a-select>

          <!-- Фильтр по доп. продаже -->
          <a-select
            v-model:value="filters.upsell"
            placeholder="Доп. продажа"
            style="min-width: 150px"
            allow-clear
          >
            <a-select-option
              v-for="u in upsells"
              :key="u._id"
              :value="u.name"
            >
              {{ u.name }}
            </a-select-option>
          </a-select>

          <!-- Кнопка сброса -->
          <a-button @click="resetFilters">Сбросить</a-button>
        </div>
      </template>
    </SearchAndSort>

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
import { ref, onMounted, watch } from "vue";
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

// Filter data
const filters = ref({
  category: undefined,
  method: undefined,
  allergen: undefined,
  upsell: undefined,
});

const dishCategories = ref([]);
const kitchenMethods = ref([]);
const allergens = ref([]);
const upsells = ref([]);

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

// Fetch filter data
const fetchFilterData = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;

  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const [catRes, methodRes, allergenRes, upsellRes] = await Promise.all([
      axios.get(`${API_URL}/dish-categories`, { 
        params: { venueId: authStore.selectedVenue._id },
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      axios.get(`${API_URL}/kitchen-methods`, { 
        params: { venueId: authStore.selectedVenue._id },
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      axios.get(`${API_URL}/allergens`, { 
        params: { venueId: authStore.selectedVenue._id },
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      axios.get(`${API_URL}/upsells`, { 
        params: { venueId: authStore.selectedVenue._id },
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
    ]);
    dishCategories.value = catRes.data || [];
    kitchenMethods.value = methodRes.data || [];
    allergens.value = allergenRes.data || [];
    upsells.value = upsellRes.data || [];
  } catch (err) {
    console.error("Ошибка при загрузке данных фильтра:", err);
    message.error("Не удалось загрузить данные фильтра");
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

const handleFilter = () => {
  filteredDishes.value = dishes.value.filter((d) => {
    const matchCategory = !filters.value.category || d.category === filters.value.category;
    const matchMethod = !filters.value.method || d.method === filters.value.method;
    const matchAllergen = !filters.value.allergen || (Array.isArray(d.allergens) && d.allergens.includes(filters.value.allergen));
    const matchUpsell = !filters.value.upsell || (Array.isArray(d.upsells) && d.upsells.includes(filters.value.upsell));
    const matchSearch = !searchQuery.value || d.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchCategory && matchMethod && matchAllergen && matchUpsell && matchSearch;
  });
  
  if (sortOrder.value) {
    sortDishes(sortOrder.value);
  }
};

const handleSearch = () => {
  handleFilter();
};

const resetFilters = () => {
  filters.value = { category: undefined, method: undefined, allergen: undefined, upsell: undefined };
};

// Watch filters for automatic application
watch(filters, () => {
  handleFilter();
}, { deep: true });

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

onMounted(() => {
  fetchDishes();
  fetchFilterData();
});
</script>
