<template>
  <a-card class="h-full flex flex-col" :bodyStyle="{ flex: '1', display: 'flex', flexDirection: 'column' }">
    <template #extra>
      <a-dropdown trigger="click">
        <a class="ant-dropdown-link" @click.prevent>
          <MoreOutlined style="font-size: 20px; cursor: pointer" />
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="$emit('edit', zone)">
              <EditOutlined /> Редактировать
            </a-menu-item>
            <a-menu-item danger>
              <a-popconfirm
                title="Удалить эту зону?"
                ok-text="Да"
                cancel-text="Нет"
                @confirm="$emit('delete', zone._id)"
              >
                <span><DeleteOutlined /> Удалить</span>
              </a-popconfirm>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
    <template #title>
      <div class="flex items-center gap-2">
        <span>{{ zone.name }}</span>
      </div>
    </template>

    <div class="flex-1">
      <div class="mb-3">
        <div class="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
          <HomeOutlined class="text-white text-6xl opacity-50" />
        </div>
      </div>

      <div class="text-gray-600">
        <p>{{ zone.description || 'Нет описания' }}</p>
      </div>
    </div>

    <div class="mt-auto pt-4 border-t border-gray-200">
      <a-descriptions size="small" :column="1" bordered>
        <a-descriptions-item label="Создано">
          {{ formatDate(zone.createdAt) }}
        </a-descriptions-item>
        <a-descriptions-item label="Обновлено">
          {{ formatDate(zone.updatedAt) }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-card>
</template>

<script setup>
import { MoreOutlined, EditOutlined, DeleteOutlined, HomeOutlined } from "@ant-design/icons-vue"

defineProps({
  zone: {
    type: Object,
    required: true
  }
})

defineEmits(['delete', 'edit'])

const formatDate = (date) => {
  if (!date) return 'Не указано';
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
</script>
