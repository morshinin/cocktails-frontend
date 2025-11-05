<template>
  <div class="p-6 max-w-5xl mx-auto">
    <a-page-header
      title="✏️ Редактирование коктейля"
      :breadcrumb="{
        routes: [
          { path: '/cocktails', breadcrumbName: 'Коктейли' },
          { path: `/cocktails/${id}/edit`, breadcrumbName: 'Редактировать' }
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
      <a-form layout="vertical" @submit.prevent="updateRecipe">
        <a-form-item label="Название">
          <a-input v-model:value="recipe.name" />
        </a-form-item>

        <a-form-item label="Категория">
          <a-select
            v-model:value="recipe.category"
            placeholder="Выберите категорию"
            :options="[
              { label: 'Classic', value: 'Classic' },
              { label: 'Signature', value: 'Signature' }
            ]"
            style="width: 200px"
          />
        </a-form-item>

        <a-form-item label="Компоненты">
          <div
            v-for="(c, i) in recipe.components"
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

        <a-form-item label="Метод">
          <a-select
            v-model:value="recipe.method"
            placeholder="Выберите метод"
            :options="methods.map(m => ({ label: m.name, value: m.name }))"
          />
        </a-form-item>

        <a-form-item label="Бокал">
          <a-input v-model:value="recipe.glass" />
        </a-form-item>

        <a-form-item label="Украшение">
          <a-input v-model:value="recipe.decoration" />
        </a-form-item>

        <a-form-item label="Описание">
          <a-textarea v-model:value="recipe.description" rows="3" />
        </a-form-item>

        <a-form-item label="Изображение">
          <div class="flex gap-4 items-center">
            <input type="file" accept="image/*" @change="onImageChange" />

            <div v-if="recipe.image">
              <img :src="recipe.image" alt="Preview" class="w-24 h-24 object-cover rounded" />
            </div>
          </div>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit">💾 Сохранить</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "axios"
import { message } from "ant-design-vue"
import { RECIPES_URL, COMPONENTS_URL, METHODS_URL, UPLOAD_URL } from '../config/api.js';

const route = useRoute()
const router = useRouter()
const id = route.params.id

const recipe = ref({
  name: "",
  category: "Signature",
  components: [],
  method: "",
  glass: "",
  decoration: "",
  description: "",
  image: "",
})

const components = ref([])
const methods = ref([])

const fetchRecipe = async () => {
  const res = await axios.get(`${RECIPES_URL}/${id}`)
  recipe.value = res.data
}

const fetchComponents = async () => {
  const res = await axios.get(COMPONENTS_URL)
  components.value = res.data
}

const fetchMethods = async () => {
  const res = await axios.get(METHODS_URL)
  methods.value = res.data
}

const addEmptyComponent = () => {
  recipe.value.components.push({ name: "", amount: 0 })
}

const removeComponent = (i) => {
  recipe.value.components.splice(i, 1)
}

const onImageChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append("image", file)

  try {
    const res = await axios.post(UPLOAD_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    recipe.value.image = res.data.url
    message.success("Изображение загружено!")
  } catch (err) {
    console.error(err)
    message.error("Ошибка при загрузке изображения")
  }
}

const updateRecipe = async () => {
  try {
    await axios.put(`${RECIPES_URL}/${id}`, recipe.value)
    message.success("Изменения сохранены")
    router.push("/cocktails")
  } catch (e) {
    console.error(e)
    message.error("Ошибка при сохранении")
  }
}

onMounted(async () => {
  await Promise.all([fetchRecipe(), fetchComponents(), fetchMethods()])
})
</script>
