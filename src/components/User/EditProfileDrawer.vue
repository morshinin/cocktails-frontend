<template>
  <a-drawer
    title="Редактировать профиль"
    :width="500"
    :open="open"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form layout="vertical" :model="formState">
      <a-form-item label="Фото профиля">
        <div class="flex flex-col items-center gap-4">
          <a-avatar :size="120" :src="photoPreview || formState.photoUrl" class="bg-green-500 text-4xl">
            {{ !photoPreview && !formState.photoUrl ? (formState.name?.[0]?.toUpperCase() || 'U') : '' }}
          </a-avatar>
          
          <a-space>
            <a-upload
              :before-upload="handleBeforeUpload"
              :show-upload-list="false"
              accept="image/*"
            >
              <a-button>
                <template #icon><UploadOutlined /></template>
                {{ formState.photoUrl ? 'Изменить фото' : 'Загрузить фото' }}
              </a-button>
            </a-upload>
            
            <a-button 
              v-if="formState.photoUrl" 
              danger 
              @click="handleDeletePhoto"
            >
              <template #icon><DeleteOutlined /></template>
              Удалить
            </a-button>
          </a-space>
        </div>
      </a-form-item>
      
      <a-form-item label="Имя" required>
        <a-input v-model:value="formState.name" placeholder="Ваше имя" />
      </a-form-item>
      
      <a-form-item label="Email" required>
        <a-input v-model:value="formState.email" placeholder="email@example.com" />
      </a-form-item>

      <a-form-item label="Новый пароль">
        <a-input-password v-model:value="formState.password" placeholder="Оставьте пустым, если не меняете" />
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="onClose">Отмена</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          Сохранить
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { message } from 'ant-design-vue';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '../../stores/auth';
import axios from 'axios';

const props = defineProps({
  open: Boolean,
  user: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:open', 'profileUpdated']);

const loading = ref(false);
const photoPreview = ref('');
const formState = reactive({
  name: '',
  email: '',
  password: '',
  photoUrl: ''
});

watch(() => props.user, (newUser) => {
  if (newUser) {
    formState.name = newUser.name || '';
    formState.email = newUser.email || '';
    formState.password = '';
    formState.photoUrl = newUser.photoUrl || '';
    photoPreview.value = '';
  }
}, { immediate: true, deep: true });

const onClose = () => {
  emit('update:open', false);
  photoPreview.value = '';
};

const handleBeforeUpload = async (file) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error('Можно загружать только изображения!');
    return false;
  }

  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error('Размер изображения не должен превышать 5MB!');
    return false;
  }

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    photoPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);

  // Upload to server
  const formData = new FormData();
  formData.append('image', file);

  try {
    const authStore = useAuthStore();
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authStore.token}`
      }
    });
    
    formState.photoUrl = res.data.url;
    message.success('Фото загружено!');
  } catch (error) {
    console.error(error);
    message.error('Ошибка при загрузке фото');
    photoPreview.value = '';
  }

  return false; // Prevent default upload behavior
};

const handleDeletePhoto = () => {
  formState.photoUrl = '';
  photoPreview.value = '';
  message.success('Фото удалено');
};

const handleSubmit = async () => {
  const authStore = useAuthStore();
  
  if (!formState.name || !formState.email) {
    return message.warning("Заполните обязательные поля");
  }

  loading.value = true;
  try {
    const updateData = {
      name: formState.name,
      email: formState.email,
      photoUrl: formState.photoUrl
    };
    
    if (formState.password) {
      updateData.password = formState.password;
    }

    await authStore.updateProfile(updateData);
    message.success("Профиль обновлен!");
    emit('profileUpdated');
    onClose();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при обновлении профиля");
  } finally {
    loading.value = false;
  }
};
</script>
