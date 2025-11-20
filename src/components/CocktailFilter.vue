<template>
  <div class="mb-4 flex flex-wrap gap-4">
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

    <!-- Кнопки -->
    <a-button type="primary" @click="applyFilters">Применить</a-button>
    <a-button @click="resetFilters">Сбросить</a-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { message } from "ant-design-vue"
import { COMPONENTS_URL, METHODS_URL, GLASSES_URL } from '../config/api.js';
import { useAuthStore } from '../stores/auth';

const filters = ref({
  category: "",
  component: "",
  glass: "",
  method: "",
})

const components = ref([])
const glasses = ref([])
const methods = ref([])

// Подгружаем данные для селектов
const fetchFilterData = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;

  try {
    const [compRes, glassRes, methodRes] = await Promise.all([
      axios.get(COMPONENTS_URL, { params: { venueId: authStore.selectedVenue._id } }),
      axios.get(GLASSES_URL, { 
        params: { venueId: authStore.selectedVenue._id },
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      axios.get(METHODS_URL, { 
        params: { venueId: authStore.selectedVenue._id },
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
    ])
    components.value = compRes.data || []
    glasses.value = glassRes.data || []
    methods.value = methodRes.data || []
  } catch (err) {
    console.error("Ошибка при загрузке данных фильтра:", err)
    message.error("Не удалось загрузить данные фильтра")
  }
}

onMounted(fetchFilterData)

// События для родителя
const applyFilters = () => {
  // Эмитим объект фильтров наружу
  emit("filter", { ...filters.value })
}

const resetFilters = () => {
  filters.value = { category: "", component: "", glass: "", method: "" }
  applyFilters()
}

// Объявляем emit для script setup
const emit = defineEmits(["filter"])
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
.flex {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
