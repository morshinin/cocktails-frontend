<template>
  <div class="p-6 max-w-5xl mx-auto">
    <a-page-header
      title="➕ Новый коктейль"
      sub-title="Добавь новый рецепт"
      :breadcrumb="{
        routes: [
          { path: '/cocktails', breadcrumbName: 'Коктейли' },
          { path: '/cocktails/new', breadcrumbName: 'Новый' }
        ]
      }"
    >
      <template #extra>
        <router-link to="/cocktails">
          <a-button>← Назад к списку</a-button>
        </router-link>
      </template>
    </a-page-header>

    <a-card>
      <a-form layout="vertical" @submit.prevent="addRecipe">
        <!-- Название -->
        <a-form-item label="Название">
          <a-input v-model:value="newRecipe.name" placeholder="Введите название" />
        </a-form-item>

        <a-form-item label="Категория">
          <a-select
            v-model:value="newRecipe.category"
            placeholder="Выберите категорию"
            :options="[
              { label: 'Classic', value: 'Classic' },
              { label: 'Signature', value: 'Signature' }
            ]"
            style="width: 200px"
          />
        </a-form-item>
        <!-- Компоненты -->
        <a-form-item label="Компоненты">
          <div
            v-for="(c, i) in newRecipe.components"
            :key="i"
            class="flex items-center gap-2 mb-2"
          >
            <a-select
              v-model:value="c.name"
              placeholder="Выберите компонент"
              style="flex: 2"
              :options="components.map(comp => ({ label: comp.name, value: comp.name }))"
            />
            <a-input-number
              v-model:value="c.amount"
              placeholder="мл"
              style="width: 100px"
              :min="0"
            />
            <a-button type="text" danger @click="removeComponent(i)">Удалить</a-button>
          </div>

          <a-button type="dashed" block @click="addEmptyComponent">
            ➕ Добавить компонент
          </a-button>
        </a-form-item>

        <!-- Метод -->
        <a-form-item label="Метод приготовления">
          <a-select
            v-model:value="newRecipe.method"
            placeholder="Выберите метод"
            :options="methods.map(m => ({ label: m.name, value: m.name }))"
          />
        </a-form-item>

        <!-- Бокал -->
        <a-form-item label="Бокал">
          <a-input v-model:value="newRecipe.glass" placeholder="Например: хайбол" />
        </a-form-item>

        <!-- Украшение -->
        <a-form-item label="Украшение">
          <a-input v-model:value="newRecipe.decoration" placeholder="Например: долька апельсина" />
        </a-form-item>

        <!-- Описание -->
        <a-form-item label="Описание">
          <a-textarea
            v-model:value="newRecipe.description"
            rows="3"
            placeholder="Описание коктейля"
          />
        </a-form-item>

        <!-- Кнопка -->
        <a-form-item>
          <a-button type="primary" html-type="submit">Добавить</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { message } from "ant-design-vue"
import { useRouter } from "vue-router"

const API_URL = "http://localhost:3000/api/recipes"
const COMPONENTS_URL = "http://localhost:3000/api/components"
const METHODS_URL = "http://localhost:3000/api/methods"

const router = useRouter()

const components = ref([])
const methods = ref([])

const newRecipe = ref({
  name: "",
  category: "Signature",
  components: [],
  method: "",
  glass: "",
  decoration: "",
  description: "",
})

const fetchComponents = async () => {
  const res = await axios.get(COMPONENTS_URL)
  components.value = res.data
}

const fetchMethods = async () => {
  const res = await axios.get(METHODS_URL)
  methods.value = res.data
}

const addEmptyComponent = () => {
  newRecipe.value.components.push({ name: "", amount: 0 })
}

const removeComponent = (i) => {
  newRecipe.value.components.splice(i, 1)
}

const addRecipe = async () => {
  if (!newRecipe.value.name) return message.warning("Введите название")

  try {
    await axios.post(API_URL, newRecipe.value)
    message.success("Коктейль добавлен")
    router.push("/cocktails")
  } catch (e) {
    console.error(e)
    message.error("Ошибка при добавлении коктейля")
  }
}

onMounted(async () => {
  await Promise.all([fetchComponents(), fetchMethods()])
})
</script>
