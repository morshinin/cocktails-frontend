<template>
  <a-drawer
    :visible="visible"
    :title="employeeToEdit ? '✏️ Редактирование сотрудника' : '➕ Новый сотрудник'"
    @close="$emit('update:visible', false)"
    :width="isMobile ? '100%' : '500px'"
    placement="right"
  >
    <a-form layout="vertical" class="pb-16">
      <a-form-item label="Имя" required>
        <a-input v-model:value="newUser.name" placeholder="Введите имя" />
      </a-form-item>

      <a-form-item label="Email" required>
        <a-input v-model:value="newUser.email" placeholder="email@example.com" />
      </a-form-item>

      <a-form-item label="Пароль" :required="!employeeToEdit">
        <a-input-password v-model:value="newUser.password" :placeholder="employeeToEdit ? 'Оставьте пустым, чтобы не менять' : 'Введите пароль'" />
      </a-form-item>

      <a-form-item label="Роль" required>
        <a-select
          v-model:value="newUser.role"
          placeholder="Выберите роль"
        >
          <a-select-option v-for="(label, value) in roleNames" :key="value" :value="value">
            {{ label }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <a-button @click="$emit('update:visible', false)">Отмена</a-button>
        <a-button type="primary" :loading="loading" @click="handleSubmit">
          {{ employeeToEdit ? 'Сохранить' : 'Добавить' }}
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue"
import axios from "axios"
import { message } from "ant-design-vue"
import { useAuthStore } from '../../stores/auth';

const props = defineProps({
  visible: Boolean,
  employeeToEdit: Object
})

const emit = defineEmits(['update:visible', 'success'])

const authStore = useAuthStore();
const loading = ref(false);
const isMobile = ref(window.innerWidth < 640)

const handleResize = () => {
  isMobile.value = window.innerWidth < 640
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const roleNames = {
  manager: 'Управляющий',
  head_bartender: 'Старший бармен',
  bartender: 'Бармен',
  head_chef: 'Шеф-повар',
  cook: 'Повар',
  cleaner: 'Клинер',
  waiter: 'Официант',
  guest: 'Гость'
};

const initialUserState = {
  name: "",
  email: "",
  password: "",
  role: "bartender"
}

const newUser = ref({ ...initialUserState })

// Reset form when drawer opens
// Reset form when drawer opens
watch(() => props.visible, (val) => {
  if (val) {
    if (props.employeeToEdit) {
      newUser.value = { 
        ...initialUserState,
        name: props.employeeToEdit.name,
        email: props.employeeToEdit.email,
        role: props.employeeToEdit.role,
        password: "" // Don't show password hash
      }
    } else {
      newUser.value = JSON.parse(JSON.stringify(initialUserState))
    }
  }
})

const handleSubmit = async () => {
  if (!newUser.value.email || (!props.employeeToEdit && !newUser.value.password)) {
    return message.warning("Заполните все обязательные поля")
  }

  loading.value = true;
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    
    if (props.employeeToEdit) {
      // Update
      const payload = {
        name: newUser.value.name,
        email: newUser.value.email,
        role: newUser.value.role,
      }
      if (newUser.value.password) payload.password = newUser.value.password;

      await axios.put(`${API_URL}/users/${props.employeeToEdit._id}`, payload, {
         headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success("Сотрудник обновлен");
    } else {
      // Create
      await axios.post(`${API_URL}/users`, {
        ...newUser.value,
        organizationId: authStore.user.organizationId
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success("Сотрудник добавлен");
    }
    
    emit('success')
    emit('update:visible', false)
  } catch (e) {
    console.error(e)
    message.error(e.response?.data?.message || "Ошибка при сохранении")
  } finally {
    loading.value = false;
  }
}
</script>
