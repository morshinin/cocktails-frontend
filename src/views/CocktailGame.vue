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
        <a-input v-model:value="playerGlass" placeholder="Бокал" style="width: 150px"/>
        <a-input v-model:value="playerMethod" placeholder="Метод" style="width: 150px"/>
        <a-input v-model:value="playerDecoration" placeholder="Украшение" style="width: 150px"/>
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
import { RECIPES_URL, COMPONENTS_URL } from '../config/api.js';

const gameStarted = ref(false)
const gameEnded = ref(false)

const cocktails = ref([])
const currentIndex = ref(0)
const currentCocktail = ref(null)
const components = ref([])

// Поля игрока
const playerGlass = ref("")
const playerMethod = ref("")
const playerDecoration = ref("")
const selectedIngredients = ref([])

// Счетчики
const totalMade = ref(0)
const correctCount = ref(0)
const wrongCount = ref(0)

// Загрузка данных
const fetchData = async () => {
  try {
    const [cocktailsRes, componentsRes] = await Promise.all([
      axios.get(RECIPES_URL),
      axios.get(COMPONENTS_URL)
    ])
    cocktails.value = cocktailsRes.data
    components.value = componentsRes.data
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
  if (
    (playerGlass.value?.trim().toLowerCase() || "") !== (currentCocktail.value.glass?.toLowerCase() || "") ||
    (playerMethod.value?.trim().toLowerCase() || "") !== (currentCocktail.value.method?.toLowerCase() || "") ||
    (playerDecoration.value?.trim().toLowerCase() || "") !== (currentCocktail.value.decoration?.toLowerCase() || "")
  ) {
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
