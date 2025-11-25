<template>
  <a-drawer
    :title="userToEdit ? 'Редактировать пользователя' : 'Создать пользователя'"
    :width="width"
    :open="open"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form layout="vertical" :model="formState">
      <a-form-item label="Email" required>
        <a-input v-model:value="formState.email" placeholder="email@example.com" :disabled="!!userToEdit" />
      </a-form-item>
      
      <a-form-item label="Пароль" :required="!userToEdit">
        <a-input-password v-model:value="formState.password" placeholder="Пароль" />
        <div v-if="userToEdit" class="text-xs text-gray-500 mt-1">Оставьте пустым, чтобы не менять</div>
      </a-form-item>

      <a-form-item label="Роль" required>
        <a-select v-model:value="formState.role">
          <a-select-option value="developer">Разработчик</a-select-option>
          <a-select-option value="owner">Владелец</a-select-option>
          <a-select-option value="manager">Управляющий</a-select-option>
          <a-select-option value="head_bartender">Старший бармен</a-select-option>
          <a-select-option value="bartender">Бармен</a-select-option>
          <a-select-option value="head_chef">Шеф-повар</a-select-option>
          <a-select-option value="cook">Повар</a-select-option>
          <a-select-option value="cleaner">Клинер</a-select-option>
          <a-select-option value="waiter">Официант</a-select-option>
          <a-select-option value="guest">Гость</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="onClose">Отмена</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          {{ userToEdit ? 'Сохранить' : 'Создать' }}
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { useAuthStore } from '../stores/auth';

const props = defineProps({
  open: Boolean,
  width: {
    type: [String, Number],
    default: 600
  },
  userToEdit: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:open', 'userAdded', 'userUpdated']);

const loading = ref(false);
const formState = reactive({
  email: "",
  password: "",
  role: "guest"
});

watch(() => props.userToEdit, (newVal) => {
  if (newVal) {
    formState.email = newVal.email;
    formState.role = newVal.role;
    formState.password = "";
  } else {
    formState.email = "";
    formState.password = "";
    formState.role = "guest";
  }
}, { immediate: true });

const onClose = () => {
  emit('update:open', false);
};

const handleSubmit = async () => {
  const authStore = useAuthStore();
  
  if (!formState.email || (!props.userToEdit && !formState.password)) {
    return message.warning("Заполните обязательные поля");
  }

  loading.value = true;
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    
    if (props.userToEdit) {
      await axios.put(`${API_URL}/users/${props.userToEdit._id}`, {
        role: formState.role
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success("Пользователь обновлен!");
      emit('userUpdated');
    } else {
      await axios.post(`${API_URL}/users`, {
        email: formState.email,
        password: formState.password,
        role: formState.role
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success("Пользователь создан!");
      emit('userAdded');
    }
    
    onClose();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при сохранении пользователя");
  } finally {
    loading.value = false;
  }
};
</script>
