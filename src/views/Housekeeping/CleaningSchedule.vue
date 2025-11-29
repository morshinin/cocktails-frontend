<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">График уборки</h1>
      <div class="flex gap-4">
        <a-date-picker v-model:value="selectedDate" @change="fetchSchedule" />
        <a-button type="primary" @click="showDrawer">
          <template #icon><PlusOutlined /></template>
          Добавить задачу
        </a-button>
      </div>
    </div>

    <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div v-if="schedule.tasks && schedule.tasks.length > 0">
        <a-list item-layout="horizontal" :data-source="schedule.tasks">
          <template #renderItem="{ item, index }">
            <a-list-item>
              <template #actions>
                <a-button 
                  type="text" 
                  danger 
                  @click="removeTask(index)"
                >
                  <DeleteOutlined />
                </a-button>
              </template>
              <a-list-item-meta>
                <template #title>
                  <div class="flex items-center gap-3">
                    <a-checkbox 
                      v-model:checked="item.isCompleted" 
                      @change="saveSchedule"
                    />
                    <span :class="{ 'line-through text-gray-500': item.isCompleted, 'text-white': !item.isCompleted }">
                      {{ item.title }}
                    </span>
                    <a-tag v-if="item.zoneId" color="blue">{{ item.zoneId.name }}</a-tag>
                  </div>
                </template>
                <template #description>
                  <div class="ml-8 text-gray-400">
                    {{ item.description }}
                  </div>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </div>
      <div v-else class="text-center py-10 text-gray-500">
        <div class="text-4xl mb-2">🧹</div>
        <p>На этот день задач нет</p>
      </div>

      <div class="mt-6 pt-6 border-t border-gray-700">
        <h3 class="text-white mb-2">Заметки</h3>
        <a-textarea 
          v-model:value="schedule.notes" 
          :rows="3" 
          placeholder="Дополнительные заметки к уборке..."
          @blur="saveSchedule"
        />
      </div>
    </div>

    <AddCleaningTaskDrawer
      v-model:visible="drawerVisible"
      @submit="addTask"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import dayjs from 'dayjs';
import AddCleaningTaskDrawer from '../../components/housekeeping/AddCleaningTaskDrawer.vue';

const selectedDate = ref(dayjs());
const schedule = ref({ tasks: [], notes: '' });
const drawerVisible = ref(false);

const fetchSchedule = async () => {
  try {
    const dateStr = selectedDate.value.format('YYYY-MM-DD');
    const response = await axios.get('/api/housekeeping/schedule', {
      params: { date: dateStr }
    });
    schedule.value = response.data || { tasks: [], notes: '' };
    if (!schedule.value.tasks) schedule.value.tasks = [];
  } catch (error) {
    console.error('Error fetching schedule:', error);
    message.error('Не удалось загрузить график');
  }
};

const saveSchedule = async () => {
  try {
    const dateStr = selectedDate.value.format('YYYY-MM-DD');
    await axios.post('/api/housekeeping/schedule', {
      date: dateStr,
      tasks: schedule.value.tasks.map(t => ({
        title: t.title,
        description: t.description,
        zoneId: t.zoneId?._id || t.zoneId,
        isCompleted: t.isCompleted
      })),
      notes: schedule.value.notes
    });
    // Don't show success message on every checkbox click to avoid spam
  } catch (error) {
    console.error('Error saving schedule:', error);
    message.error('Не удалось сохранить изменения');
  }
};

const showDrawer = () => {
  drawerVisible.value = true;
};

const addTask = async (task) => {
  schedule.value.tasks.push({
    ...task,
    isCompleted: false
  });
  await saveSchedule();
  fetchSchedule(); // Refresh to get populated fields
  message.success('Задача добавлена');
};

const removeTask = async (index) => {
  schedule.value.tasks.splice(index, 1);
  await saveSchedule();
  message.success('Задача удалена');
};

onMounted(() => {
  fetchSchedule();
});
</script>
