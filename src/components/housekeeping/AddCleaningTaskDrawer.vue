<template>
  <a-drawer
    title="Добавить задачу"
    :width="500"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form :model="formState" layout="vertical" @finish="onFinish">
      <a-form-item
        label="Название задачи"
        name="title"
        :rules="[{ required: true, message: 'Пожалуйста, введите название' }]"
      >
        <a-input v-model:value="formState.title" placeholder="Что нужно сделать?" />
      </a-form-item>

      <a-form-item
        label="Зона"
        name="zoneId"
      >
        <a-select v-model:value="formState.zoneId" placeholder="Выберите зону (необязательно)">
          <a-select-option v-for="zone in zones" :key="zone._id" :value="zone._id">
            {{ zone.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="Описание"
        name="description"
      >
        <a-textarea
          v-model:value="formState.description"
          :rows="4"
          placeholder="Подробности задачи..."
        />
      </a-form-item>
      
      <div class="drawer-footer">
        <a-space>
          <a-button @click="onClose">Отмена</a-button>
          <a-button type="primary" html-type="submit">Добавить</a-button>
        </a-space>
      </div>
    </a-form>
  </a-drawer>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(['update:visible', 'submit']);

const formState = reactive({
  title: '',
  description: '',
  zoneId: undefined
});

const zones = ref([]);

const fetchZones = async () => {
  try {
    const response = await axios.get('/api/housekeeping/zones');
    zones.value = response.data;
  } catch (error) {
    console.error('Error fetching zones:', error);
  }
};

onMounted(() => {
  fetchZones();
});

const onClose = () => {
  emit('update:visible', false);
};

const onFinish = () => {
  emit('submit', { ...formState });
  formState.title = '';
  formState.description = '';
  formState.zoneId = undefined;
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
