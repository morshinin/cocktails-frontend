<template>
  <a-badge-ribbon :text="getStatusLabel(counter.status)" :color="getStatusColor(counter.status)" :style="{ top: '71px' }">
    <a-card class="h-full flex flex-col" :bodyStyle="{ flex: '1', display: 'flex', flexDirection: 'column' }">
      <template #extra>
        <a-dropdown trigger="click">
          <a class="ant-dropdown-link" @click.prevent>
            <MoreOutlined style="font-size: 20px; cursor: pointer" />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="$emit('edit', counter)">
                <EditOutlined /> Редактировать
              </a-menu-item>
              <a-menu-item danger>
                <a-popconfirm
                  title="Удалить эту барную стойку?"
                  ok-text="Да"
                  cancel-text="Нет"
                  @confirm="$emit('delete', counter._id)"
                >
                  <span><DeleteOutlined /> Удалить</span>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
      <template #title>
        <router-link :to="`/bar-counters/${counter._id}`" class="flex items-center gap-2">
          <span>{{ counter.name }}</span>
        </router-link>
      </template>

      <div class="flex-1">
        <div class="mb-3">
          <img
            :src="counter.imageUrl || placeholderImage"
            alt="bar counter image"
            class="w-full h-48 object-cover rounded"
          />
        </div>

        <div v-if="counter.description" class="mb-3 text-gray-600">
          {{ counter.description }}
        </div>
      </div>

      <div class="mt-auto pt-4 border-t border-gray-200">
        <a-descriptions size="small" :column="1" bordered>
          <a-descriptions-item v-if="counter.location" label="Расположение">
            {{ counter.location }}
          </a-descriptions-item>
          <a-descriptions-item v-if="counter.capacity" label="Вместимость">
            {{ counter.capacity }} мест
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-card>
  </a-badge-ribbon>
</template>

<script setup>
import { MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import placeholderImage from '../../assets/cocktail_placeholder.png';

defineProps({
  counter: {
    type: Object,
    required: true
  }
});

defineEmits(['edit', 'delete']);

const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return 'green';
    case 'Inactive': return 'gray';
    case 'Maintenance': return 'orange';
    default: return 'default';
  }
};

const getStatusLabel = (status) => {
  const labels = {
    'Active': 'Активна',
    'Inactive': 'Неактивна',
    'Maintenance': 'На обслуживании'
  };
  return labels[status] || status;
};
</script>

<style scoped>
/* No custom styles needed */
</style>
