<template>
  <a-drawer
    :title="glassToEdit ? 'Редактировать бокал' : 'Добавить новый бокал'"
    :width="width"
    :open="open"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form layout="vertical" :model="newGlass">
      <a-form-item label="Название" required>
        <a-input v-model:value="newGlass.name" placeholder="Введите название бокала (например: Хайбол)" />
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="onClose">Отмена</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          {{ glassToEdit ? 'Сохранить' : 'Добавить' }}
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { GLASSES_URL } from '../../config/api.js';
import { useAuthStore } from '../../stores/auth';

const props = defineProps({
  open: Boolean,
  width: {
    type: [String, Number],
    default: 600
  },
  glassToEdit: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:open', 'glassAdded', 'glassUpdated']);

const loading = ref(false);
const newGlass = reactive({
  name: ""
});

watch(() => props.glassToEdit, (newVal) => {
  if (newVal) {
    newGlass.name = newVal.name;
  } else {
    newGlass.name = "";
  }
}, { immediate: true });

const onClose = () => {
  emit('update:open', false);
};

const handleSubmit = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return message.error("Venue not selected");
  
  if (!newGlass.name.trim()) {
    return message.warning("Введите название");
  }

  loading.value = true;
  try {
    if (props.glassToEdit) {
      await axios.put(`${GLASSES_URL}/${props.glassToEdit._id}`, {
        name: newGlass.name
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success("Бокал обновлен!");
      emit('glassUpdated');
    } else {
      await axios.post(GLASSES_URL, {
        name: newGlass.name,
        venueId: authStore.selectedVenue._id
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success("Бокал добавлен!");
      emit('glassAdded');
    }
    
    onClose();
  } catch (e) {
    console.error(e);
    if (e.response?.status === 409) {
      message.warning("Такой бокал уже существует");
    } else {
      message.error("Ошибка при сохранении бокала");
    }
  } finally {
    loading.value = false;
  }
};
</script>
