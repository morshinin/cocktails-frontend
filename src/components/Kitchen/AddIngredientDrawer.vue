<template>
  <a-drawer
    :title="ingredientToEdit ? 'Редактировать ингредиент' : 'Добавить ингредиент'"
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


      <a-form-item label="Изображение">
        <div class="flex gap-4 items-center">
          <input type="file" accept="image/*" @change="onImageChange" />

          <div v-if="formState.image">
            <img :src="formState.image" alt="Preview" class="w-24 h-24 object-cover rounded" />
          </div>
        </div>
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="onClose">Отмена</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          {{ ingredientToEdit ? 'Сохранить' : 'Создать' }}
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { useAuthStore } from '../../stores/auth';
import { UPLOAD_URL } from '../../config/api.js';

const props = defineProps({
  open: Boolean,
  ingredientToEdit: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:open', 'ingredientAdded', 'ingredientUpdated']);

const loading = ref(false);
const formState = reactive({
  name: '',
  category: '',
  description: '',
  image: ''
});

watch(() => props.ingredientToEdit, (newVal) => {
  if (newVal) {
    formState.name = newVal.name || '';
    formState.category = newVal.category || '';
    formState.description = newVal.description || '';
    formState.image = newVal.image || '';
  } else {
    formState.name = '';
    formState.category = '';
    formState.description = '';
    formState.image = '';
  }
}, { immediate: true });

const onClose = () => {
  emit('update:open', false);
};

const onImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post(UPLOAD_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    formState.image = res.data.url;
    message.success("Изображение загружено!");
  } catch (err) {
    console.error(err);
    message.error("Ошибка при загрузке изображения");
  }
};

const handleSubmit = async () => {
  const authStore = useAuthStore();
  
  if (!formState.name) {
    return message.warning("Введите название ингредиента");
  }

  loading.value = true;
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    
    if (props.ingredientToEdit) {
      // Update existing ingredient
      await axios.put(`${API_URL}/ingredients/${props.ingredientToEdit._id}`, {
        ...formState,
        venueId: authStore.selectedVenue._id
      });
      message.success("Ингредиент обновлён!");
      emit('ingredientUpdated');
    } else {
      // Create new ingredient
      await axios.post(`${API_URL}/ingredients`, {
        ...formState,
        venueId: authStore.selectedVenue._id
      });
      message.success("Ингредиент создан!");
      emit('ingredientAdded');
    }
    
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
