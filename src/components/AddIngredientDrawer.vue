<template>
  <a-drawer
    title="Добавить ингредиент"
    :width="600"
    :open="open"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form layout="vertical" :model="formState">
      <a-form-item label="Название" required>
        <a-input v-model:value="formState.name" placeholder="Название ингредиента" />
      </a-form-item>
      
      <a-form-item label="Категория">
        <a-input v-model:value="formState.category" placeholder="Овощи, Мясо, Специи..." />
      </a-form-item>

      <a-form-item label="Описание">
        <a-textarea v-model:value="formState.description" placeholder="Описание" :rows="4" />
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
import { useAuthStore } from '../stores/auth';

const props = defineProps({
  open: Boolean
});

const emit = defineEmits(['update:open', 'ingredientAdded']);

const loading = ref(false);
const formState = reactive({
  name: '',
  category: '',
  description: '',
  image: ''
});

const onClose = () => {
  emit('update:open', false);
};

const handleSubmit = async () => {
  const authStore = useAuthStore();
  
  if (!formState.name) {
    return message.warning("Введите название ингредиента");
  }

  loading.value = true;
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    await axios.post(`${API_URL}/ingredients`, {
      ...formState,
      venueId: authStore.selectedVenue._id
    });
    message.success("Ингредиент создан!");
    
    // Reset form
    formState.name = '';
    formState.category = '';
    formState.description = '';
    formState.image = '';
    
    emit('ingredientAdded');
    onClose();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при создании ингредиента");
  } finally {
    loading.value = false;
  }
};
</script>
