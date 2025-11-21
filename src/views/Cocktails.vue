<template>
  <div class="p-6 max-w-5xl mx-auto">
    <a-page-header
      title="🍸 Коктейли"
      sub-title="Список рецептов"
      :breadcrumb="{ routes: [{ path: '/cocktails', breadcrumbName: 'Коктейли' }] }"
    >
      <template #extra>
        <router-link to="/cocktails/new">
          <a-button type="primary">➕ Добавить коктейль</a-button>
        </router-link>
      </template>
    </a-page-header>

    <CocktailFilter @filter="applyFilters" />

    <a-row :gutter="[16, 16]">
      <a-col v-for="r in filteredRecipes" :key="r._id" :xs="24" :sm="12" :md="8">
        <a-card>
          <template #title>
            <router-link :to="`/cocktails/${r._id}`" class="flex justify-between items-center">
              <span>{{ r.name }}</span>
              <a-tag :color="r.category === 'Classic' ? 'blue' : 'purple'">
                {{ r.category }}
              </a-tag>
            </router-link>
          </template>

          <div v-if="r.image" class="mb-3">
            <img
              :src="r.image"
              alt="cocktail image"
              class="w-full h-48 object-cover rounded"
            />
          </div>

          <a-table
            :columns="[
              { title: 'Ингредиент', dataIndex: 'name', key: 'name' },
              { title: 'Количество (мл)', dataIndex: 'amount', key: 'amount' }
            ]"
            :data-source="r.components"
            size="small"
            :pagination="false"
            bordered
          />

          <div class="mt-2">
            <strong>Метод:</strong>
            <template v-if="Array.isArray(r.method)">
              <a-tag v-for="m in r.method" :key="m" color="blue">{{ m }}</a-tag>
            </template>
            <span v-else>{{ r.method }}</span>
          </div>
          <p><strong>Бокал:</strong> {{ r.glass }}</p>
          <p><strong>Украшение:</strong> {{ r.decoration }}</p>
          <p>{{ r.description }}</p>

          <div class="mt-2 flex justify-end gap-2">
            <router-link :to="`/cocktails/${r._id}/edit`">
              <a-button type="text">✏️</a-button>
            </router-link>

            <router-link :to="`/instruction/${r._id}`">
              <a-button type="text">📖</a-button>
            </router-link>

            <a-popconfirm
              title="Удалить этот рецепт?"
              ok-text="Да"
              cancel-text="Нет"
              @confirm="deleteRecipe(r._id)"
            >
              <a-button danger type="text">🗑</a-button>
            </a-popconfirm>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { message } from "ant-design-vue"
import CocktailFilter from "../components/CocktailFilter.vue"
import { RECIPES_URL } from '../config/api.js';
import { useAuthStore } from '../stores/auth';

const recipes = ref([])
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

const applyFilters = (filters) => {
  filteredRecipes.value = recipes.value.filter((r) => {
    const matchCategory = !filters.category || r.category === filters.category
    const matchComponent =
      !filters.component ||
      r.components.some((c) => c.name === filters.component)
    const matchGlass = !filters.glass || r.glass === filters.glass
    const matchMethod = !filters.method || (Array.isArray(r.method) ? r.method.includes(filters.method) : r.method === filters.method)
    return matchCategory && matchComponent && matchGlass && matchMethod
  })
}

const deleteRecipe = async (id) => {
  await axios.delete(`${RECIPES_URL}/${id}`)
  message.info("Коктейль удалён")
  await fetchRecipes()
}

onMounted(fetchRecipes)
</script>
