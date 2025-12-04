<template>
  <a-badge-ribbon v-if="ingredient.category" :text="ingredient.category" color="green" :style="{ top: '71px' }">
    <a-card class="h-full flex flex-col" :bodyStyle="{ flex: '1', display: 'flex', flexDirection: 'column' }">
      <template #extra>
        <a-dropdown trigger="click">
          <a class="ant-dropdown-link" @click.prevent>
            <MoreOutlined style="font-size: 20px; cursor: pointer" />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="$emit('edit', ingredient)">
                <EditOutlined /> Редактировать
              </a-menu-item>
              <a-menu-item danger>
                <a-popconfirm
                  title="Удалить этот ингредиент?"
                  ok-text="Да"
                  cancel-text="Нет"
                  @confirm="$emit('delete', ingredient._id)"
                >
                  <span><DeleteOutlined /> Удалить</span>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
      <template #title>
        <span class="flex items-center gap-2">
          <span>{{ ingredient.name }}</span>
        </span>
      </template>

      <div class="flex-1">
        <div class="mb-3">
          <img
            :src="ingredient.image || placeholderImage"
            :alt="ingredient.name"
            class="w-full h-48 object-cover rounded"
            @error="e => e.target.src = placeholderImage"
          />
        </div>

        <div v-if="ingredient.description" class="text-sm text-gray-600 mb-3">
          {{ ingredient.description }}
        </div>
      </div>

      <div class="mt-auto pt-4 border-t border-gray-200">
        <a-descriptions size="small" :column="1" bordered>
          <a-descriptions-item v-if="ingredient.unit" label="Единица измерения">
            {{ ingredient.unit }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-card>
  </a-badge-ribbon>
  
  <a-card v-else class="h-full flex flex-col" :bodyStyle="{ flex: '1', display: 'flex', flexDirection: 'column' }">
    <template #extra>
      <a-dropdown trigger="click">
        <a class="ant-dropdown-link" @click.prevent>
          <MoreOutlined style="font-size: 20px; cursor: pointer" />
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="$emit('edit', ingredient)">
              <EditOutlined /> Редактировать
            </a-menu-item>
            <a-menu-item danger>
              <a-popconfirm
                title="Удалить этот ингредиент?"
                ok-text="Да"
                cancel-text="Нет"
                @confirm="$emit('delete', ingredient._id)"
              >
                <span><DeleteOutlined /> Удалить</span>
              </a-popconfirm>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
    <template #title>
      <span class="flex items-center gap-2">
        <span>{{ ingredient.name }}</span>
      </span>
    </template>

    <div class="flex-1">
      <div class="mb-3">
        <img
          :src="ingredient.image || placeholderImage"
          :alt="ingredient.name"
          class="w-full h-48 object-cover rounded"
          @error="e => e.target.src = placeholderImage"
        />
      </div>

      <div v-if="ingredient.description" class="text-sm text-gray-600 mb-3">
        {{ ingredient.description }}
      </div>
    </div>

    <div class="mt-auto pt-4 border-t border-gray-200">
      <a-descriptions size="small" :column="1" bordered>
        <a-descriptions-item v-if="ingredient.unit" label="Единица измерения">
          {{ ingredient.unit }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-card>
</template>

<script setup>
import { MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons-vue"
import placeholderImage from '../../assets/cocktail_placeholder.png';

defineProps({
  ingredient: {
    type: Object,
    required: true
  }
})

defineEmits(['delete', 'edit'])
</script>
