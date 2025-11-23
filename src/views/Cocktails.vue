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
        <a-card class="h-full flex flex-col" :bodyStyle="{ flex: '1', display: 'flex', flexDirection: 'column' }">
          <template #extra>
            <a-dropdown trigger="click">
              <a class="ant-dropdown-link" @click.prevent>
                <MoreOutlined style="font-size: 20px; cursor: pointer" />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <router-link :to="`/cocktails/${r._id}/edit`">
                      <EditOutlined /> Редактировать
                    </router-link>
                  </a-menu-item>
                  <a-menu-item>
                    <router-link :to="`/instruction/${r._id}`">
                      <ReadOutlined /> Инструкция
                    </router-link>
                  </a-menu-item>
                  <a-menu-item danger>
                    <a-popconfirm
                      title="Удалить этот рецепт?"
                      ok-text="Да"
                      cancel-text="Нет"
                      @confirm="deleteRecipe(r._id)"
                    >
                      <span><DeleteOutlined /> Удалить</span>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <template #title>
            <router-link :to="`/cocktails/${r._id}`" class="flex items-center gap-2">
              <a-tag :color="r.category === 'Classic' ? 'blue' : 'purple'" :title="r.category">
                {{ r.category[0] }}
              </a-tag>
              <span>{{ r.name }}</span>
            </router-link>
          </template>

          <div class="flex-1">
            <div class="mb-3">
              <img
                :src="r.image || placeholderImage"
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
              :showHeader="false"
            />
          </div>

          <div class="mt-auto pt-4 border-t border-gray-200">
            <div class="mb-2">
              <strong>Метод:</strong>
              <template v-if="Array.isArray(r.method)">
                <a-tag v-for="m in r.method" :key="m" color="blue">{{ m }}</a-tag>
              </template>
              <span v-else>{{ r.method }}</span>
            </div>
            <div class="mb-2"><strong>Бокал:</strong> {{ r.glass }}</div>
            <div>
              <strong>Украшение:</strong>
              <template v-if="Array.isArray(r.decoration)">
                <a-tag v-for="d in r.decoration" :key="d" color="green">{{ d }}</a-tag>
              </template>
              <span v-else>{{ r.decoration }}</span>
            </div>
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
import { MoreOutlined, EditOutlined, ReadOutlined, DeleteOutlined } from "@ant-design/icons-vue"
import CocktailFilter from "../components/CocktailFilter.vue"
import { RECIPES_URL } from '../config/api.js';
import { useAuthStore } from '../stores/auth';
import placeholderImage from '../assets/cocktail_placeholder.png';

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
    const matchDecoration = !filters.decoration || (Array.isArray(r.decoration) ? r.decoration.includes(filters.decoration) : r.decoration === filters.decoration)
    return matchCategory && matchComponent && matchGlass && matchMethod && matchDecoration
  })
}

const deleteRecipe = async (id) => {
  await axios.delete(`${RECIPES_URL}/${id}`)
  message.info("Коктейль удалён")
  await fetchRecipes()
}

onMounted(fetchRecipes)
</script>
