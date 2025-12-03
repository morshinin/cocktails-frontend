<template>
  <a-drawer
    :title="methodToEdit ? 'Редактировать метод' : 'Добавить новый метод'"
    :width="width"
    :open="open"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form layout="vertical" :model="newMethod">
      <a-form-item label="Название" required>
        <a-input v-model:value="newMethod.name" placeholder="Введите название метода (например: Шейк)" />
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="onClose">Отмена</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          {{ methodToEdit ? 'Сохранить' : 'Добавить' }}
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

const props = defineProps({
  open: Boolean,
  width: {
    type: [String, Number],
    default: 600
  },
  methodToEdit: {
    type: Object,
    default: null
  },
  category: {
    type: String,
    default: 'bar'
  },
  apiUrl: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:open', 'methodAdded', 'methodUpdated']);

const loading = ref(false);
const newMethod = reactive({
  name: ""
});

watch(() => props.methodToEdit, (newVal) => {
  if (newVal) {
    newMethod.name = newVal.name;
  } else {
    newMethod.name = "";
  }
}, { immediate: true });

const onClose = () => {
  emit('update:open', false);
};

const handleSubmit = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return message.error("Venue not selected");
  
  if (!newMethod.name.trim()) {
    return message.warning("Введите название");
  }

  loading.value = true;
  try {
    if (props.methodToEdit) {
      await axios.put(`${props.apiUrl}/${props.methodToEdit._id}`, {
        name: newMethod.name
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success("Метод обновлен!");
      emit('methodUpdated');
    } else {
      await axios.post(props.apiUrl, {
        name: newMethod.name,
        venueId: authStore.selectedVenue._id
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success("Метод добавлен!");
      emit('methodAdded');
    }
    
    onClose();
  } catch (e) {
    console.error(e);
    if (e.response?.status === 409) {
      message.warning("Такой метод уже существует");
    } else {
      message.error("Ошибка при сохранении метода");
    }
  } finally {
    loading.value = false;
  }
};
</script>
