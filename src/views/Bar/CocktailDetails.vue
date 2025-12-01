<template>
  <div class="p-6 max-w-7xl mx-auto">
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

    <div v-if="loading" class="text-center py-12">
      <a-spin size="large" />
    </div>

    <a-card v-else-if="cocktail">
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

      <div class="mt-2">
        <strong>Метод:</strong>
        <template v-if="Array.isArray(cocktail.method)">
          <a-tag v-for="m in cocktail.method" :key="m" color="blue">{{ m }}</a-tag>
        </template>
        <span v-else>{{ cocktail.method }}</span>
      </div>
      <p><strong>Бокал:</strong> {{ cocktail.glass }}</p>
      <div class="mt-2">
        <strong>Украшение:</strong>
        <template v-if="Array.isArray(cocktail.decoration)">
          <a-tag v-for="d in cocktail.decoration" :key="d" color="green">{{ d }}</a-tag>
        </template>
        <span v-else>{{ cocktail.decoration }}</span>
      </div>
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


  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "axios"
import { message } from "ant-design-vue"
import { RECIPES_URL } from '../../config/api.js';
import { useAuthStore } from '../../stores/auth';

const route = useRoute()
const router = useRouter()
const cocktail = ref(null)
const loading = ref(false)

const fetchCocktail = async () => {
  const authStore = useAuthStore()
  loading.value = true
  try {
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 500));
    const [res] = await Promise.all([
      axios.get(`${RECIPES_URL}/${route.params.id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      minLoadTime
    ]);
    cocktail.value = res.data
  } catch (err) {
    console.error("Ошибка при загрузке коктейля:", err)
    message.error("Не удалось загрузить коктейль")
  } finally {
    loading.value = false
  }
}

// ===== Удаление =====
const deleteCocktail = async () => {
  const authStore = useAuthStore()
  try {
    await axios.delete(`${RECIPES_URL}/${route.params.id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    message.success("Коктейль удалён")
    router.push("/cocktails")
  } catch (err) {
    console.error("Ошибка при удалении:", err)
    message.error("Не удалось удалить коктейль")
  }
}

onMounted(fetchCocktail)
</script>
