<template>
  <div class="p-6 max-w-3xl mx-auto">
    <a-page-header title="🍸 Коктейли" sub-title="Управляй рецептами" />

    <a-card class="mb-4" title="Добавить новый коктейль">
      <a-form layout="vertical" @submit.prevent="addRecipe">
        <a-form-item label="Название">
          <a-input v-model:value="newRecipe.name" placeholder="Введите название" />
        </a-form-item>

        <a-form-item label="Компоненты">
          <a-select
            v-model:value="selectedComponent"
            placeholder="Выберите компонент"
            style="width: 100%"
          >
            <a-select-option
              v-for="c in components"
              :key="c._id"
              :value="c.name"
            >
              {{ c.name }}
            </a-select-option>
          </a-select>

          <a-button
            class="mt-2"
            type="dashed"
            block
            @click="addComponentToRecipe"
          >
            ➕ Добавить компонент
          </a-button>

          <div class="mt-2 flex flex-wrap gap-2">
            <a-tag
              v-for="(c, i) in newRecipe.components"
              :key="i"
              closable
              @close="removeComponent(i)"
            >
              {{ c }}
            </a-tag>
          </div>
        </a-form-item>

        <a-form-item label="Метод">
          <a-select
            v-model:value="selectedMethod"
            placeholder="Выберите метод"
            style="width: 100%"
          >
            <a-select-option
              v-for="c in method"
              :key="c._id"
              :value="c.name"
            >
              {{ c.name }}
            </a-select-option>
          </a-select>

          <a-button
            class="mt-2"
            type="dashed"
            block
            @click="addMethodToRecipe"
          >
            ➕ Добавить метод
          </a-button>

          <div class="mt-2 flex flex-wrap gap-2">
            <a-tag
              v-for="(c, i) in newRecipe.method"
              :key="i"
              closable
              @close="removeComponent(i)"
            >
              {{ c }}
            </a-tag>
          </div>
        </a-form-item>

        <a-form-item label="Бокал">
          <a-input v-model:value="newRecipe.glass" placeholder="Например: хайбол" />
        </a-form-item>

        <a-form-item label="Метод">
          <a-input v-model:value="newRecipe.decoration" placeholder="Например: слайс грейпфрута" />
        </a-form-item>

        <a-form-item label="Описание">
          <a-textarea
            v-model:value="newRecipe.description"
            :rows="3"
            placeholder="Описание коктейля"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit">Добавить</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-list v-for="r in recipes" :key="r._id">
      <a-card :title="r.name">
        <a-list :data-source="r.components">
          <template #header> Компоненты </template>
          <template #renderItem="{ item }">
            <a-list-item>{{ item }}</a-list-item>
          </template>
        </a-list>

        <p>Метод: {{ r.method }}</p>
        <p>Бокал: {{ r.glass }}</p>
        <p>Украшение: {{ r.decoration }}</p>
        <p>Описание: {{ r.description }}</p>
      </a-card>
    </a-list>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from "vue";
import axios from "axios";
import { message, Popconfirm } from "ant-design-vue";
import { RECIPES_URL, COMPONENTS_URL, METHODS_URL } from '../config/api.js';

const recipes = ref([]);
const components = ref([]);
const method = ref([]);
const selectedComponent = ref("");
const selectedMethod = ref("");

const newRecipe = ref({
  name: "",
  components: [],
  method: "",
  glass: "",
  decoration: "",
  description: "",
});

const fetchRecipes = async () => {
  try {
    const res = await axios.get(RECIPES_URL);
    // гарантируем, что поле Компоненты всегда массив
    recipes.value = (res.data || []).map((r) => ({
      ...r,
      components: Array.isArray(r.components)
        ? r.components
        : r.components
          ? [r.components]
          : [],
    }));
  } catch (e) {
    console.error(e);
    message.error("Не удалось загрузить рецепты");
  }
};

const fetchComponents = async () => {
  try {
    const res = await axios.get(COMPONENTS_URL);
    components.value = res.data || [];
  } catch (e) {
    console.error(e);
    message.error("Не удалось загрузить компоненты");
  }
};

const fetchMethod = async () => {
  try {
    const res = await axios.get(METHODS_URL);
    method.value = res.data || [];
  } catch (e) {
    console.error(e);
    message.error("Не удалось загрузить методы");
  }
};

const addRecipe = async () => {
  if (!newRecipe.value.name) return message.warning("Введите название");

  try {
    await axios.post(RECIPES_URL, newRecipe.value);
    message.success("Коктейль добавлен");
    await fetchRecipes();

    // сбрасываем поля
    newRecipe.value = {
      name: "",
      components: [],
      method: "",
      glass: "",
      decoration: "",
      description: "",
    };
    selectedComponent.value = "";
  } catch (e) {
    console.error(e);
    message.error("Ошибка при добавлении рецепта");
  }
};

const addComponentToRecipe = () => {
  if (
    selectedComponent.value &&
    !newRecipe.value.components.includes(selectedComponent.value)
  ) {
    newRecipe.value.components.push(selectedComponent.value);
    selectedComponent.value = "";
  }
};

const addMethodToRecipe = () => {
  if (
    selectedMethod.value &&
    !newRecipe.value.method.includes(selectedMethod.value)
  ) {
    newRecipe.value.method.push(selectedMethod.value);
    selectedMethod.value = "";
  }
};

const removeComponent = (i) => {
  newRecipe.value.components.splice(i, 1);
};

const deleteRecipe = async (id) => {
  try {
    await axios.delete(`${RECIPES_URL}/${id}`);
    message.info("Коктейль удалён");
    await fetchRecipes();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при удалении");
  }
};

// компонент отображения строки в списке
const renderItem = (item) =>
  h(
    "a-list-item",
    {},
    {
      default: () => [
        h("div", [
          h("strong", item.name || "Без названия"),
          h(
            "div",
            `Компоненты: ${
              Array.isArray(item.components)
                ? item.components.join(", ")
                : ""
            }`
          ),
          h("div", `Метод: ${item.method || "-"}`),
          h("div", `Бокал: ${item.glass || "-"}`),
          item.description
            ? h("div", { style: "color: #555" }, `Описание: ${item.description}`)
            : null,
        ]),
      ],
      actions: () => [
        h(
          Popconfirm,
          {
            title: "Удалить этот рецепт?",
            okText: "Да",
            cancelText: "Нет",
            onConfirm: () => deleteRecipe(item._id),
          },
          {
            default: () => h("a", { style: "color: red" }, "Удалить"),
          }
        ),
      ],
    }
  );

onMounted(async () => {
  await Promise.all([fetchRecipes(), fetchComponents(), fetchMethod()]);
});
</script>

<style scoped>
.ant-page-header {
  margin-bottom: 16px;
}
</style>
