<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">🍺 Барные стойки</h1>
      <a-button type="primary" @click="showDrawer = true">
        ➕ Добавить стойку
      </a-button>
    </div>

    <AddBarCounterDrawer
      v-model:visible="showDrawer"
      :counter="editingCounter"
      @submit="handleSubmit"
    />

    <div v-if="loading" class="text-center py-12">
      <a-spin size="large" />
    </div>

    <div v-else>
      <div class="mb-4 text-gray-600">
        {{ getCountText(counters.length) }}
      </div>

      <a-row :gutter="[16, 16]">
        <a-col v-for="counter in counters" :key="counter._id" :xs="24" :sm="12" :md="8">
          <BarCounterCard :counter="counter" @edit="editCounter" @delete="deleteCounter" />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import BarCounterCard from "../../components/Bar/BarCounterCard.vue";
import AddBarCounterDrawer from "../../components/Bar/AddBarCounterDrawer.vue";
import { BAR_COUNTERS_URL } from '../../config/api.js';
import { useAuthStore } from '../../stores/auth';

const counters = ref([]);
const showDrawer = ref(false);
const editingCounter = ref(null);
const loading = ref(false);

const fetchCounters = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;
  
  loading.value = true;
  try {
    const res = await axios.get(BAR_COUNTERS_URL, {
      params: { venueId: authStore.selectedVenue._id },
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    counters.value = res.data;
  } catch (e) {
    console.error(e);
    message.error("Не удалось загрузить барные стойки");
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async (formData) => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return message.error("Venue not selected");

  try {
    if (formData._id) {
      // Update existing
      await axios.put(`${BAR_COUNTERS_URL}/${formData._id}`, formData, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success("Барная стойка обновлена");
    } else {
      // Create new
      await axios.post(BAR_COUNTERS_URL, {
        ...formData,
        venueId: authStore.selectedVenue._id,
        organizationId: authStore.user.organizationId
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success("Барная стойка добавлена");
    }
    editingCounter.value = null;
    await fetchCounters();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при сохранении барной стойки");
  }
};

const editCounter = (counter) => {
  editingCounter.value = counter;
  showDrawer.value = true;
};

const deleteCounter = async (id) => {
  const authStore = useAuthStore();
  try {
    await axios.delete(`${BAR_COUNTERS_URL}/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    message.info("Барная стойка удалена");
    await fetchCounters();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при удалении");
  }
};

const getCountText = (count) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count} барных стоек`;
  }

  if (lastDigit === 1) {
    return `${count} барная стойка`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} барные стойки`;
  }

  return `${count} барных стоек`;
};

onMounted(fetchCounters);
</script>
