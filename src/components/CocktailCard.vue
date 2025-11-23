<template>
  <a-badge-ribbon :text="recipe.category" :color="recipe.category === 'Classic' ? 'blue' : 'purple'" :style="{ top: '71px' }">
    <a-card class="h-full flex flex-col" :bodyStyle="{ flex: '1', display: 'flex', flexDirection: 'column' }">
      <template #extra>
        <a-dropdown trigger="click">
          <a class="ant-dropdown-link" @click.prevent>
            <MoreOutlined style="font-size: 20px; cursor: pointer" />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <router-link :to="`/cocktails/${recipe._id}/edit`">
                  <EditOutlined /> Редактировать
                </router-link>
              </a-menu-item>
              <a-menu-item>
                <router-link :to="`/instruction/${recipe._id}`">
                  <ReadOutlined /> Инструкция
                </router-link>
              </a-menu-item>
              <a-menu-item danger>
                <a-popconfirm
                  title="Удалить этот рецепт?"
                  ok-text="Да"
                  cancel-text="Нет"
                  @confirm="$emit('delete', recipe._id)"
                >
                  <span><DeleteOutlined /> Удалить</span>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
      <template #title>
        <router-link :to="`/cocktails/${recipe._id}`" class="flex items-center gap-2">
          <span>{{ recipe.name }}</span>
        </router-link>
      </template>

      <div class="flex-1">
        <div class="mb-3">
          <img
            :src="recipe.image || placeholderImage"
            alt="cocktail image"
            class="w-full h-48 object-cover rounded"
          />
        </div>

        <a-table
          class="ingredients-table"
          :columns="[
            { title: 'Ингредиент', dataIndex: 'name', key: 'name' },
            { title: 'Количество (мл)', dataIndex: 'amount', key: 'amount' }
          ]"
          :data-source="recipe.components"
          size="small"
          :pagination="false"
          :showHeader="false"
        />
      </div>

      <div class="mt-auto pt-4 border-t border-gray-200">
        <div class="mb-2">
          <strong>Метод:</strong>
          <template v-if="Array.isArray(recipe.method)">
            <a-tag v-for="m in recipe.method" :key="m" color="blue">{{ m }}</a-tag>
          </template>
          <span v-else>{{ recipe.method }}</span>
        </div>
        <div class="mb-2"><strong>Бокал:</strong> {{ recipe.glass }}</div>
        <div>
          <strong>Украшение:</strong>
          <template v-if="Array.isArray(recipe.decoration)">
            <a-tag v-for="d in recipe.decoration" :key="d" color="green">{{ d }}</a-tag>
          </template>
          <span v-else>{{ recipe.decoration }}</span>
        </div>
      </div>
    </a-card>
  </a-badge-ribbon>
</template>

<script setup>
import { MoreOutlined, EditOutlined, ReadOutlined, DeleteOutlined } from "@ant-design/icons-vue"
import placeholderImage from '../assets/cocktail_placeholder.png';

defineProps({
  recipe: {
    type: Object,
    required: true
  }
})

defineEmits(['delete'])
</script>

<style scoped>
.ingredients-table :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: none !important;
}
</style>
