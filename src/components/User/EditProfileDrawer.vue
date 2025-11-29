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
import { useAuthStore } from '../../stores/auth';

const props = defineProps({
  open: Boolean,
  user: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:open', 'profileUpdated']);

const loading = ref(false);
const formState = reactive({
  name: '',
  email: '',
  password: ''
});

watch(() => props.user, (newUser) => {
  if (newUser) {
    formState.name = newUser.name || '';
    formState.email = newUser.email || '';
    formState.password = '';
  }
}, { immediate: true, deep: true });

const onClose = () => {
  emit('update:open', false);
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
      email: formState.email
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
