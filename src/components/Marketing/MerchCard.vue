<template>
  <a-card class="h-full flex flex-col" :bodyStyle="{ flex: '1', display: 'flex', flexDirection: 'column' }">
    <template #extra>
      <a-dropdown trigger="click">
        <a class="ant-dropdown-link" @click.prevent>
          <MoreOutlined style="font-size: 20px; cursor: pointer" />
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="$emit('edit', item)">
              <EditOutlined /> Редактировать
            </a-menu-item>
            <a-menu-item danger>
              <a-popconfirm
                title="Удалить этот товар?"
                ok-text="Да"
                cancel-text="Нет"
                @confirm="$emit('delete', item._id)"
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
        <span>{{ item.name }}</span>
      </div>
    </template>

    <div class="flex-1">
      <div class="mb-3">
        <img
          :src="item.imageUrl || placeholderImage"
          :alt="item.name"
          class="w-full h-48 object-cover rounded"
        />
      </div>

      <div class="mb-3">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xl font-bold text-blue-600">₽ {{ item.price }}</span>
          <a-tag :color="item.stock > 0 ? 'green' : 'red'">
            {{ item.stock > 0 ? `В наличии: ${item.stock}` : 'Нет в наличии' }}
          </a-tag>
        </div>
        
        <p class="text-gray-600 text-sm line-clamp-3">
          {{ item.description || 'Нет описания' }}
        </p>
      </div>
    </div>
  </a-card>
</template>

<script setup>
import { MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons-vue"
import placeholderImage from '../../assets/cocktail_placeholder.png';

defineProps({
  item: {
    type: Object,
    required: true
  }
})

defineEmits(['delete', 'edit'])
</script>
