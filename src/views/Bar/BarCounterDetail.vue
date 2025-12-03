<template>
  <div class="p-6 max-w-7xl mx-auto">
    <a-page-header
      :title="counter?.name || 'Барная стойка'"
      :breadcrumb="{
        routes: [
          { path: '/bar-counters', breadcrumbName: 'Барные стойки' },
          { path: '', breadcrumbName: counter?.name || 'Детали' }
        ]
      }"
      @back="() => $router.push('/bar-counters')"
    >
      <template #extra>
        <a-button @click="$router.push('/bar-counters')">
          Назад к списку
        </a-button>
      </template>
    </a-page-header>

    <div v-if="loading" class="text-center py-12">
      <a-spin size="large" />
    </div>

    <div v-else-if="counter" class="mt-6">
      <a-card>
        <p class="text-gray-500">
          Детальная страница барной стойки будет реализована позже.
        </p>
        <p class="mt-4">
          <strong>Название:</strong> {{ counter.name }}
        </p>
        <p v-if="counter.description">
          <strong>Описание:</strong> {{ counter.description }}
        </p>
        <p v-if="counter.location">
          <strong>Расположение:</strong> {{ counter.location }}
        </p>
        <p v-if="counter.capacity">
          <strong>Вместимость:</strong> {{ counter.capacity }} мест
        </p>
        <p>
          <strong>Статус:</strong> 
          <a-tag :color="getStatusColor(counter.status)">
            {{ getStatusLabel(counter.status) }}
          </a-tag>
        </p>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { message } from "ant-design-vue";
import { BAR_COUNTERS_URL } from '../../config/api.js';
import { useAuthStore } from '../../stores/auth';

const route = useRoute();
const router = useRouter();
const counter = ref(null);
const loading = ref(false);

const fetchCounter = async () => {
  const authStore = useAuthStore();
  loading.value = true;
  try {
    const res = await axios.get(`${BAR_COUNTERS_URL}/${route.params.id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    counter.value = res.data;
  } catch (e) {
    console.error(e);
    message.error("Не удалось загрузить барную стойку");
    router.push('/bar-counters');
  } finally {
    loading.value = false;
  }
};

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

onMounted(fetchCounter);
</script>
