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
        <a-descriptions size="small" :column="1" bordered>
          <a-descriptions-item label="Метод">
            {{ Array.isArray(recipe.method) ? recipe.method.join(', ') : recipe.method }}
          </a-descriptions-item>
          <a-descriptions-item label="Бокал">
            {{ recipe.glass }}
          </a-descriptions-item>
          <a-descriptions-item label="Украшение">
            {{ Array.isArray(recipe.decoration) ? recipe.decoration.join(', ') : recipe.decoration }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-card>
  </a-badge-ribbon>
</template>

<script setup>
import { MoreOutlined, EditOutlined, ReadOutlined, DeleteOutlined } from "@ant-design/icons-vue"
import placeholderImage from '../../assets/cocktail_placeholder.png';

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
