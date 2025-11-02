<template>
  <div class="p-6 max-w-3xl mx-auto">
    <a-page-header
      :title="'🍸' + cocktail?.name"
      :sub-title="cocktail?.category"
      :breadcrumb="{
        routes: [
          { path: '/cocktails', breadcrumbName: 'Коктейли' },
          { path: `/cocktails/${cocktail?._id}`, breadcrumbName: cocktail?.name }
        ]
      }"
    >
      <template #extra>
        <router-link to="/cocktails">
          <a-button>← Назад к списку</a-button>
        </router-link>
      </template>
    </a-page-header>

    <a-card v-if="cocktail">
      <a-table
        :columns="[
          { title: 'Ингредиент', dataIndex: 'name', key: 'name' },
          { title: 'Количество (мл)', dataIndex: 'amount', key: 'amount' }
        ]"
        :data-source="cocktail.components"
        size="small"
        :pagination="false"
        bordered
      />

      <p class="mt-2"><strong>Метод:</strong> {{ cocktail.method }}</p>
      <p><strong>Бокал:</strong> {{ cocktail.glass }}</p>
      <p><strong>Украшение:</strong> {{ cocktail.decoration }}</p>
      <p>{{ cocktail.description }}</p>

      <div class="mt-4 flex gap-2 justify-end">
        <!-- Кнопка редактирования -->
        <router-link :to="`/cocktails/${cocktail._id}/edit`">
          <a-button type="primary">✏️ Редактировать</a-button>
        </router-link>

        <!-- Кнопка удаления с подтверждением -->
        <a-popconfirm
          title="Удалить этот коктейль?"
          ok-text="Да"
          cancel-text="Нет"
          @confirm="deleteCocktail"
        >
          <a-button type="danger">🗑 Удалить</a-button>
        </a-popconfirm>
      </div>
    </a-card>

    <a-spin v-else tip="Загрузка..." />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "axios"
import { message } from "ant-design-vue"

const route = useRoute()
const router = useRouter()
const cocktail = ref(null)
const API_URL = "http://localhost:3000/api/recipes"

const fetchCocktail = async () => {
  try {
    const res = await axios.get(`${API_URL}/${route.params.id}`)
    cocktail.value = res.data
  } catch (err) {
    console.error("Ошибка при загрузке коктейля:", err)
    message.error("Не удалось загрузить коктейль")
  }
}

// ===== Удаление =====
const deleteCocktail = async () => {
  try {
    await axios.delete(`${API_URL}/${route.params.id}`)
    message.success("Коктейль удалён")
    router.push("/cocktails")
  } catch (err) {
    console.error("Ошибка при удалении:", err)
    message.error("Не удалось удалить коктейль")
  }
}

onMounted(fetchCocktail)
</script>
