<template>
  <a-badge-ribbon :text="getStatusLabel(event.status)" :color="getStatusColor(event.status)" :style="{ top: '71px' }">
    <a-card class="h-full flex flex-col" :bodyStyle="{ flex: '1', display: 'flex', flexDirection: 'column' }">
      <template #extra>
        <a-dropdown trigger="click">
          <a class="ant-dropdown-link" @click.prevent>
            <MoreOutlined style="font-size: 20px; cursor: pointer" />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="$emit('edit', event)">
                <EditOutlined /> Редактировать
              </a-menu-item>
              <a-menu-item danger>
                <a-popconfirm
                  title="Удалить это событие?"
                  ok-text="Да"
                  cancel-text="Нет"
                  @confirm="$emit('delete', event._id)"
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
          <span>{{ event.title }}</span>
        </div>
      </template>

      <div class="flex-1">
        <div class="mb-3">
          <img
            :src="event.imageUrl || placeholderImage"
            alt="event poster"
            class="w-full h-48 object-cover rounded"
          />
        </div>

        <div v-if="event.description" class="mb-3 text-gray-600">
          {{ event.description }}
        </div>
      </div>

      <div class="mt-auto pt-4 border-t border-gray-200">
        <a-descriptions size="small" :column="1" bordered>
          <a-descriptions-item label="Дата">
            {{ formatDate(event.date) }}
          </a-descriptions-item>
          <a-descriptions-item label="Время">
            {{ event.startTime }}{{ event.endTime ? ` - ${event.endTime}` : '' }}
          </a-descriptions-item>
          <a-descriptions-item v-if="event.djId" label="DJ">
            {{ typeof event.djId === 'object' ? event.djId.name : event.djId }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-card>
  </a-badge-ribbon>
</template>

<script setup>
import { MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import dayjs from 'dayjs';
import placeholderImage from '../../assets/event_placeholder.png';

defineProps({
  event: {
    type: Object,
    required: true
  }
});

defineEmits(['edit', 'delete']);

const formatDate = (date) => {
  return dayjs(date).format('DD MMMM YYYY');
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Scheduled': return 'blue';
    case 'Completed': return 'green';
    case 'Cancelled': return 'red';
    default: return 'default';
  }
};

const getStatusLabel = (status) => {
  const labels = {
    'Scheduled': 'Запланировано',
    'Completed': 'Завершено',
    'Cancelled': 'Отменено'
  };
  return labels[status] || status;
};
</script>

<style scoped>
/* No custom styles needed */
</style>
