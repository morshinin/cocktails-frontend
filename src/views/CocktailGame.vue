<template>
  <div class="p-6 max-w-6xl mx-auto">
    <!-- Верхняя панель -->
    <div class="flex justify-between items-center mb-4">
      <div v-if="gameStarted">
        <h2 class="text-2xl font-bold">Приготовьте: {{ currentCocktail?.name || "" }}</h2>
      </div>
      <div class="flex gap-4 items-center">
        <div>Сделано: {{ totalMade }}</div>
        <div>✔ Правильно: {{ correctCount }}</div>
        <div>❌ Неправильно: {{ wrongCount }}</div>
        <a-button v-if="gameStarted" danger @click="endGame">Завершить игру</a-button>
      </div>
    </div>

    <!-- Кнопка начала игры -->
    <div v-if="!gameStarted" class="text-center">
      <a-button type="primary" size="large" @click="startGame">Начать игру</a-button>
    </div>

    <!-- Игровая зона -->
    <div v-else>
      <!-- Поля ввода для бокала, метода и украшения -->
      <a-space class="mb-4">
        <a-select
          v-model:value="playerGlass"
          placeholder="Бокал"
          style="width: 200px"
          :options="glasses.map(g => ({ label: g.name, value: g.name }))"
        />
        <a-select
          v-model:value="playerMethod"
          mode="multiple"
          placeholder="Метод"
          style="width: 200px"
          :options="methods.map(m => ({ label: m.name, value: m.name }))"
        />
        <a-select
          v-model:value="playerDecoration"
          mode="multiple"
          placeholder="Украшение"
          style="width: 200px"
          :options="decorations.map(d => ({ label: d.name, value: d.name }))"
        />
      </a-space>

      <!-- Кнопки ингредиентов -->
      <div class="flex flex-wrap gap-2 mb-4">
        <a-button
          v-for="comp in components"
          :key="comp._id"
          type="default"
          @click="addIngredient(comp)"
        >
          {{ comp.name }}
        </a-button>
      </div>

      <!-- Выбранные ингредиенты с полями количества -->
      <div class="mb-4">
        <div
          v-for="(ing, index) in selectedIngredients"
          :key="index"
          class="flex gap-2 items-center mb-2"
        >
          <span>{{ ing.name }}</span>
          <a-input-number v-model:value="ing.amount" :min="0" placeholder="мл"/>
          <a-button type="text" danger @click="removeIngredient(index)">Удалить</a-button>
        </div>
      </div>

      <!-- Кнопка сдачи коктейля -->
      <a-button type="primary" @click="submitCocktail">Отдать коктейль</a-button>
    </div>

    <!-- Результаты после завершения игры -->
    <div v-if="gameEnded" class="mt-6">
      <h3 class="text-xl font-bold mb-2">Игра завершена</h3>
      <p>Всего коктейлей: {{ totalMade }}</p>
      <p>Правильно: {{ correctCount }}</p>
      <p>Неправильно: {{ wrongCount }}</p>
      <a-button type="primary" @click="resetGame">Начать заново</a-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { message } from "ant-design-vue"
import { RECIPES_URL, COMPONENTS_URL, GLASSES_URL, METHODS_URL, DECORATIONS_URL } from '../config/api.js';
import { useAuthStore } from '../stores/auth';

const gameStarted = ref(false)
const gameEnded = ref(false)

const cocktails = ref([])
const currentIndex = ref(0)
const currentCocktail = ref(null)
const components = ref([])
const glasses = ref([])
const methods = ref([])
const decorations = ref([])

// Поля игрока
const playerGlass = ref(undefined)
const playerMethod = ref([])
const playerDecoration = ref([])
const selectedIngredients = ref([])

// Счетчики
const totalMade = ref(0)
const correctCount = ref(0)
const wrongCount = ref(0)

// Загрузка данных
const fetchData = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;

  try {
    const [cocktailsRes, componentsRes, glassesRes, methodsRes, decorationsRes] = await Promise.all([
      axios.get(RECIPES_URL, { params: { venueId: authStore.selectedVenue._id } }),
      axios.get(COMPONENTS_URL, { params: { venueId: authStore.selectedVenue._id } }),
      axios.get(GLASSES_URL, { params: { venueId: authStore.selectedVenue._id }, headers: { Authorization: `Bearer ${authStore.token}` } }),
      axios.get(METHODS_URL, { params: { venueId: authStore.selectedVenue._id }, headers: { Authorization: `Bearer ${authStore.token}` } }),
      axios.get(DECORATIONS_URL, { params: { venueId: authStore.selectedVenue._id }, headers: { Authorization: `Bearer ${authStore.token}` } })
    ])
    cocktails.value = cocktailsRes.data
    components.value = componentsRes.data
    glasses.value = glassesRes.data
    methods.value = methodsRes.data
    decorations.value = decorationsRes.data
  } catch (err) {
    console.error(err)
    message.error("Ошибка загрузки данных")
  }
}

// Игра
const startGame = () => {
  if (!cocktails.value.length) return message.warning("Нет коктейлей для игры")
  gameStarted.value = true
  gameEnded.value = false
  currentIndex.value = 0
  currentCocktail.value = cocktails.value[currentIndex.value]
  resetPlayerInputs()
}

const endGame = () => {
  gameEnded.value = true
  gameStarted.value = false
}

const resetGame = () => {
  totalMade.value = 0
  correctCount.value = 0
  wrongCount.value = 0
  selectedIngredients.value = []
  playerGlass.value = ""
  playerMethod.value = ""
  playerDecoration.value = ""
  startGame()
}

const resetPlayerInputs = () => {
  selectedIngredients.value = []
  playerGlass.value = ""
  playerMethod.value = ""
  playerDecoration.value = ""
}

const addIngredient = (comp) => {
  if (!selectedIngredients.value.find(i => i.name === comp.name)) {
    selectedIngredients.value.push({ name: comp.name, amount: 0 })
  }
}

const removeIngredient = (index) => {
  selectedIngredients.value.splice(index, 1)
}

const submitCocktail = () => {
  if (!currentCocktail.value) return

  let correct = true

  // Проверка бокала, метода, украшения
  // Проверка бокала
  if ((playerGlass.value || "") !== (currentCocktail.value.glass || "")) {
    correct = false
  }

  // Проверка метода (сравнение массивов)
  const sortArr = (arr) => (Array.isArray(arr) ? [...arr].sort() : [arr].sort())
  const currentMethods = sortArr(currentCocktail.value.method || [])
  const playerMethods = sortArr(playerMethod.value || [])
  if (JSON.stringify(currentMethods) !== JSON.stringify(playerMethods)) {
    correct = false
  }

  // Проверка украшения (сравнение массивов)
  const currentDecorations = sortArr(currentCocktail.value.decoration || [])
  const playerDecorations = sortArr(playerDecoration.value || [])
  if (JSON.stringify(currentDecorations) !== JSON.stringify(playerDecorations)) {
    correct = false
  }

  // Проверка ингредиентов
  for (let ing of currentCocktail.value.components || []) {
    const sel = selectedIngredients.value.find(s => s.name === ing.name && Number(s.amount) === Number(ing.amount))
    if (!sel) {
      correct = false
      break
    }
  }

  totalMade.value++
  if (correct) correctCount.value++
  else wrongCount.value++

  // Переход к следующему коктейлю
  if (currentIndex.value < cocktails.value.length - 1) {
    currentIndex.value++
    currentCocktail.value = cocktails.value[currentIndex.value]
    resetPlayerInputs()
  } else {
    endGame()
    message.info("Игра завершена")
  }
}

onMounted(fetchData)
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
.flex {
  display: flex;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}
.flex-wrap {
  flex-wrap: wrap;
}
.gap-2 {
  gap: 8px;
}
.gap-4 {
  gap: 16px;
}
</style>
