<template>
  <div class="p-6 max-w-3xl mx-auto">
    <a-page-header
      :title="component?.name || 'Компонент'"
      sub-title="Описание ингредиента"
      @back="$router.push('/cocktailComponents')"
    />

    <a-card v-if="component" bordered>
      <div class="flex gap-6">
        <img
          v-if="component.image"
          :src="component.image"
          alt="component image"
          class="w-48 h-48 object-cover rounded-lg shadow"
        />
        <div>
          <p><strong>Категория:</strong> {{ component.category || '—' }}</p>
          <p class="mt-2">{{ component.description || 'Описание отсутствует' }}</p>
        </div>
      </div>
    </a-card>

    <a-empty v-else description="Компонент не найден" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import axios from "axios"

const route = useRoute()
const component = ref(null)

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/api/components/${route.params.id}`)
    component.value = res.data
  } catch (err) {
    console.error("Ошибка загрузки компонента:", err)
  }
})
</script>
