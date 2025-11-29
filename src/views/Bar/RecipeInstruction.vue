<template>
  <div class="p-6 max-w-3xl mx-auto">
    <a-page-header
      :title="cocktail?.name || 'Инструкция'"
      :breadcrumb="{ routes: [{ path: '/cocktails', breadcrumbName: 'Коктейли' }, { path: '', breadcrumbName: 'Инструкция' }] }"
    >
      <template #extra>
        <router-link to="/cocktails">
          <a-button>← Назад</a-button>
        </router-link>
      </template>
    </a-page-header>

    <div v-if="!loading">
      <a-card v-if="instruction" title="Пошаговое приготовление">
        <ol class="list-decimal list-inside space-y-2">
          <li v-for="step in instruction.steps" :key="step.order">
            {{ step.text }}
          </li>
        </ol>
      </a-card>

      <a-card v-else title="Инструкция отсутствует">
        <p>Для этого коктейля пока нет инструкции.</p>
        <router-link :to="`/create-instruction?recipeId=${cocktailId}`">
          <a-button type="primary">Создать инструкцию</a-button>
        </router-link>
      </a-card>
    </div>
    <a-spin v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { useRoute } from "vue-router"
import { RECIPES_URL, INSTRUCTIONS_URL } from '../../config/api.js';

const route = useRoute()
const cocktailId = route.params.id

const cocktail = ref(null)
const instruction = ref(null)
const loading = ref(true)

const loadData = async () => {
  try {
    const [cocktailRes, instructionRes] = await Promise.all([
      axios.get(`${RECIPES_URL}/${cocktailId}`),
      axios.get(`${INSTRUCTIONS_URL}/${cocktailId}`).catch(() => null)
    ])

    cocktail.value = cocktailRes.data
    instruction.value = instructionRes?.data || null
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>
