<template>
  <a-drawer
    :title="isEditing ? 'Редактировать событие' : 'Новое событие'"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form :model="formState" layout="vertical" @finish="onFinish">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item
            label="Название"
            name="title"
            :rules="[{ required: true, message: 'Пожалуйста, введите название' }]"
          >
            <a-input v-model:value="formState.title" placeholder="Название вечеринки" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item
            label="Дата"
            name="date"
            :rules="[{ required: true, message: 'Выберите дату' }]"
          >
            <a-date-picker v-model:value="formState.date" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="Начало"
            name="startTime"
            :rules="[{ required: true, message: 'Выберите время начала' }]"
          >
            <a-time-picker v-model:value="formState.startTime" format="HH:mm" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="Конец"
            name="endTime"
          >
            <a-time-picker v-model:value="formState.endTime" format="HH:mm" style="width: 100%" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            label="DJ"
            name="djId"
          >
            <a-select v-model:value="formState.djId" placeholder="Выберите DJ">
              <a-select-option v-for="dj in djs" :key="dj._id" :value="dj._id">
                {{ dj.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Статус"
            name="status"
          >
            <a-select v-model:value="formState.status">
              <a-select-option value="Scheduled">Запланировано</a-select-option>
              <a-select-option value="Completed">Завершено</a-select-option>
              <a-select-option value="Cancelled">Отменено</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Афиша URL" name="imageUrl">
            <a-input v-model:value="formState.imageUrl" placeholder="https://example.com/poster.jpg" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Описание" name="description">
            <a-textarea v-model:value="formState.description" :rows="4" placeholder="Описание мероприятия" />
          </a-form-item>
        </a-col>
      </a-row>

      <div class="drawer-footer">
        <a-space>
          <a-button @click="onClose">Отмена</a-button>
          <a-button type="primary" html-type="submit">Сохранить</a-button>
        </a-space>
      </div>
    </a-form>
  </a-drawer>
</template>

<script setup>
import { reactive, watch, ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import axios from 'axios';
import { useAuthStore } from '../../stores/auth.js';

const auth = useAuthStore();

const props = defineProps({
  visible: Boolean,
  event: Object
});

const emit = defineEmits(['update:visible', 'submit']);

const djs = ref([]);

const formState = reactive({
  title: '',
  date: dayjs(),
  startTime: dayjs(),
  endTime: null,
  djId: undefined,
  imageUrl: '',
  description: '',
  status: 'Scheduled'
});

const isEditing = ref(false);

const fetchDJs = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/events/djs`, {
      params: { venueId: auth.selectedVenue?._id },
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    djs.value = response.data;
  } catch (error) {
    console.error('Error fetching DJs:', error);
  }
};

watch(
  () => props.event,
  (newVal) => {
    if (newVal) {
      formState.title = newVal.title;
      formState.date = dayjs(newVal.date);
      formState.startTime = dayjs(newVal.date).hour(parseInt(newVal.startTime.split(':')[0])).minute(parseInt(newVal.startTime.split(':')[1]));
      formState.endTime = newVal.endTime ? dayjs(newVal.date).hour(parseInt(newVal.endTime.split(':')[0])).minute(parseInt(newVal.endTime.split(':')[1])) : null;
      formState.djId = newVal.djId?._id || newVal.djId;
      formState.imageUrl = newVal.imageUrl;
      formState.description = newVal.description;
      formState.status = newVal.status;
      isEditing.value = true;
    } else {
      formState.title = '';
      formState.date = dayjs();
      formState.startTime = dayjs();
      formState.endTime = null;
      formState.djId = undefined;
      formState.imageUrl = '';
      formState.description = '';
      formState.status = 'Scheduled';
      isEditing.value = false;
    }
  },
  { immediate: true }
);

onMounted(() => {
  fetchDJs();
});

const onClose = () => {
  emit('update:visible', false);
};

const onFinish = () => {
  const payload = {
    ...formState,
    date: formState.date.format('YYYY-MM-DD'),
    startTime: formState.startTime.format('HH:mm'),
    endTime: formState.endTime ? formState.endTime.format('HH:mm') : null,
    _id: props.event?._id
  };
  emit('submit', payload);
  onClose();
};
</script>

<style scoped>
.drawer-footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: right;
  z-index: 1;
}
</style>
