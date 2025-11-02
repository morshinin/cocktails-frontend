<template>
  <div class="p-6 max-w-4xl mx-auto">
    <a-page-header
      title="📜 Создать инструкцию"
      :breadcrumb="{ routes: [{ path: '/cocktails', breadcrumbName: 'Коктейли' }, { path: '', breadcrumbName: 'Создание инструкции' }] }"
    >
      <template #extra>
        <router-link to="/cocktails">
          <a-button>← Назад</a-button>
        </router-link>
      </template>
    </a-page-header>

    <a-card>
      <a-form layout="vertical" @submit.prevent="saveInstruction">
        <!-- Выбор рецепта -->
        <a-form-item label="Коктейль">
          <a-select
            v-model:value="selectedRecipeId"
            placeholder="Выберите коктейль"
            :options="recipes.map(r => ({ label: r.name, value: r._id }))"
            @change="loadRecipeData"
          />
        </a-form-item>

        <!-- Основной блок -->
        <div v-if="recipeData">
          <a-divider>Автоматически сгенерированные шаги</a-divider>

          <div v-for="(step, i) in steps" :key="i" class="flex items-center gap-2 mb-2">
            <a-input
              v-model:value="step.text"
              :addon-before="`${i + 1}.`"
              placeholder="Введите шаг"
              style="flex: 1"
            />
            <a-button type="text" danger @click="removeStep(i)">Удалить</a-button>
          </div>

          <a-button type="dashed" block @click="addStep">➕ Добавить шаг</a-button>

          <a-form-item class="mt-4">
            <a-button type="primary" html-type="submit">Сохранить инструкцию</a-button>
          </a-form-item>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { message } from "ant-design-vue"

const RECIPES_URL = "http://localhost:3000/api/recipes"
const INSTRUCTIONS_URL = "http://localhost:3000/api/instructions"

const recipes = ref([])
const recipeData = ref(null)
const selectedRecipeId = ref(null)
const steps = ref([])

const fetchRecipes = async () => {
  const res = await axios.get(RECIPES_URL)
  recipes.value = res.data
}

// 🧠 Генерация шагов из рецепта
const generateStepsFromRecipe = (recipe) => {
  const baseSteps = []

  if (recipe.components?.length) {
    baseSteps.push(
      `Подготовьте шейкер или стакан для смешивания.`
    )

    for (const c of recipe.components) {
      baseSteps.push(`Добавьте ${c.amount} мл ${c.name}.`)
    }
  }

  if (recipe.method) {
    baseSteps.push(
      `Используйте метод приготовления: ${recipe.method.toLowerCase()}.`
    )
  }

  if (recipe.glass) {
    baseSteps.push(`Перелейте коктейль в ${recipe.glass.toLowerCase()}.`)
  }

  if (recipe.decoration) {
    baseSteps.push(`Украсьте ${recipe.decoration.toLowerCase()}.`)
  }

  baseSteps.push("Подавайте немедленно и наслаждайтесь!")

  steps.value = baseSteps.map((text, index) => ({
    order: index + 1,
    text
  }))
}

const loadRecipeData = async () => {
  try {
    const res = await axios.get(`${RECIPES_URL}/${selectedRecipeId.value}`)
    recipeData.value = res.data
    generateStepsFromRecipe(recipeData.value)
  } catch (e) {
    console.error(e)
    message.error("Не удалось загрузить рецепт")
  }
}

const addStep = () => {
  steps.value.push({ order: steps.value.length + 1, text: "" })
}

const removeStep = (i) => {
  steps.value.splice(i, 1)
  // Перенумеровать
  steps.value = steps.value.map((s, idx) => ({ ...s, order: idx + 1 }))
}

const saveInstruction = async () => {
  if (!selectedRecipeId.value) return message.warning("Выберите коктейль")

  await axios.post(`${INSTRUCTIONS_URL}/${selectedRecipeId.value}`, {
    steps: steps.value
  })
  message.success("Инструкция сохранена")
}

onMounted(fetchRecipes)
</script>

<style scoped>
.mb-2 {
  margin-bottom: 8px;
}
</style>
