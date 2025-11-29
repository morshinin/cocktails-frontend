<template>
  <a-drawer
    title="Добавить блюдо"
    :width="600"
    :open="open"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form layout="vertical" :model="formState">
      <a-form-item label="Название" required>
        <a-input v-model:value="formState.name" placeholder="Название блюда" />
      </a-form-item>
      
      <a-form-item label="Описание">
        <a-textarea v-model:value="formState.description" placeholder="Описание блюда" :rows="4" />
      </a-form-item>

      <a-form-item label="Цена">
        <a-input-number v-model:value="formState.price" :min="0" style="width: 100%" />
      </a-form-item>

      <a-form-item label="Ссылка на изображение">
        <a-input v-model:value="formState.image" placeholder="https://..." />
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="onClose">Отмена</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          Создать
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { useAuthStore } from '../../stores/auth';

const props = defineProps({
  open: Boolean
});

const emit = defineEmits(['update:open', 'dishAdded']);

const loading = ref(false);
const formState = reactive({
  name: '',
  description: '',
  price: null,
  image: ''
});

const onClose = () => {
  emit('update:open', false);
};

const handleSubmit = async () => {
  const authStore = useAuthStore();
  
  if (!formState.name) {
    return message.warning("Введите название блюда");
  }

  loading.value = true;
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    await axios.post(`${API_URL}/dishes`, {
      ...formState,
      venueId: authStore.selectedVenue._id
    });
    message.success("Блюдо создано!");
    
    // Reset form
    formState.name = '';
    formState.description = '';
    formState.price = null;
    formState.image = '';
    
    emit('dishAdded');
    onClose();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при создании блюда");
  } finally {
    loading.value = false;
  }
};
</script>
