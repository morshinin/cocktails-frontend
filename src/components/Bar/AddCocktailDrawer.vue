<template>
  <a-drawer
    :visible="visible"
    title="➕ Новый коктейль"
    @close="$emit('update:visible', false)"
    :width="isMobile ? '100%' : '600px'"
    placement="right"
  >
    <a-form layout="vertical" class="pb-16">
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
          mode="multiple"
          placeholder="Выберите методы"
          :options="methods.map(m => ({ label: m.name, value: m.name }))"
        />
      </a-form-item>

      <!-- Бокал -->
      <a-form-item label="Бокал">
        <a-select
          v-model:value="newRecipe.glass"
          placeholder="Выберите бокал"
          :options="glasses.map(g => ({ label: g.name, value: g.name }))"
        />
      </a-form-item>

      <!-- Украшение -->
      <a-form-item label="Украшение">
        <a-select
          v-model:value="newRecipe.decoration"
          mode="multiple"
          placeholder="Выберите украшения"
          :options="decorations.map(d => ({ label: d.name, value: d.name }))"
        />
      </a-form-item>

      <!-- Описание -->
      <a-form-item label="Описание">
        <a-textarea
          v-model:value="newRecipe.description"
          rows="3"
          placeholder="Описание коктейля"
        />
      </a-form-item>

      <!-- Изображение -->
      <a-form-item label="Изображение">
        <div class="flex gap-4 items-center">
          <input type="file" accept="image/*" @change="onImageChange" />

          <div v-if="newRecipe.image">
            <img :src="newRecipe.image" alt="Preview" class="w-24 h-24 object-cover rounded" />
          </div>
        </div>
      </a-form-item>
    </a-form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <a-button @click="$emit('update:visible', false)">Отмена</a-button>
        <a-button type="primary" @click="addRecipe">Добавить</a-button>
      </div>
    </template>
  </a-drawer>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue"
import axios from "axios"
import { message } from "ant-design-vue"
import { RECIPES_URL, COMPONENTS_URL, METHODS_URL, GLASSES_URL, DECORATIONS_URL, UPLOAD_URL } from "../../config/api"
import { useAuthStore } from '../../stores/auth';

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['update:visible', 'success'])

const isMobile = ref(window.innerWidth < 640)

const handleResize = () => {
  isMobile.value = window.innerWidth < 640
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const components = ref([])
const methods = ref([])
const glasses = ref([])
const decorations = ref([])

const initialRecipeState = {
  name: "",
  category: "Signature",
  components: [],
  method: [],
  glass: "",
  decoration: [],
  description: "",
  image: "",
}

const newRecipe = ref({ ...initialRecipeState })

// Reset form when drawer opens
watch(() => props.visible, (val) => {
  if (val) {
    newRecipe.value = JSON.parse(JSON.stringify(initialRecipeState))
  }
})

const fetchComponents = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;
  const res = await axios.get(COMPONENTS_URL, {
    params: { venueId: authStore.selectedVenue._id }
  })
  components.value = res.data
}

const fetchMethods = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;
  const res = await axios.get(METHODS_URL, {
    params: { venueId: authStore.selectedVenue._id },
    headers: { Authorization: `Bearer ${authStore.token}` }
  })
  methods.value = res.data
}

const fetchGlasses = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;
  const res = await axios.get(GLASSES_URL, {
    params: { venueId: authStore.selectedVenue._id },
    headers: { Authorization: `Bearer ${authStore.token}` }
  })
  glasses.value = res.data
}

const fetchDecorations = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;
  const res = await axios.get(DECORATIONS_URL, {
    params: { venueId: authStore.selectedVenue._id },
    headers: { Authorization: `Bearer ${authStore.token}` }
  })
  decorations.value = res.data
}

const addEmptyComponent = () => {
  newRecipe.value.components.push({ name: "", amount: 0 })
}

const removeComponent = (i) => {
  newRecipe.value.components.splice(i, 1)
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
    newRecipe.value.image = res.data.url
    message.success("Изображение загружено!")
  } catch (err) {
    console.error(err)
    message.error("Ошибка при загрузке изображения")
  }
}

const addRecipe = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return message.error("Venue not selected");

  if (!newRecipe.value.name) return message.warning("Введите название")

  try {
    await axios.post(RECIPES_URL, {
      ...newRecipe.value,
      venueId: authStore.selectedVenue._id
    })
    message.success("Коктейль добавлен")
    emit('success')
    emit('update:visible', false)
  } catch (e) {
    console.error(e)
    message.error("Ошибка при добавлении коктейля")
  }
}

onMounted(async () => {
  await Promise.all([fetchComponents(), fetchMethods(), fetchGlasses(), fetchDecorations()])
})
</script>
