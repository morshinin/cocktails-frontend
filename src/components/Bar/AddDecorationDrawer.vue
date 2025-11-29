<template>
  <a-drawer
    :title="decorationToEdit ? 'Редактировать украшение' : 'Добавить новое украшение'"
    :width="width"
    :open="open"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form layout="vertical" :model="newDecoration">
      <a-form-item label="Название" required>
        <a-input v-model:value="newDecoration.name" placeholder="Введите название украшения (например: Долька лимона)" />
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="onClose">Отмена</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          {{ decorationToEdit ? 'Сохранить' : 'Добавить' }}
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { DECORATIONS_URL } from '../../config/api.js';
import { useAuthStore } from '../../stores/auth';

const props = defineProps({
  open: Boolean,
  width: {
    type: [String, Number],
    default: 600
  },
  decorationToEdit: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:open', 'decorationAdded', 'decorationUpdated']);

const loading = ref(false);
const newDecoration = reactive({
  name: ""
});

watch(() => props.decorationToEdit, (newVal) => {
  if (newVal) {
    newDecoration.name = newVal.name;
  } else {
    newDecoration.name = "";
  }
}, { immediate: true });

const onClose = () => {
  emit('update:open', false);
};

const handleSubmit = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return message.error("Venue not selected");
  
  if (!newDecoration.name.trim()) {
    return message.warning("Введите название");
  }

  loading.value = true;
  try {
    if (props.decorationToEdit) {
      await axios.put(`${DECORATIONS_URL}/${props.decorationToEdit._id}`, {
        name: newDecoration.name
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success("Украшение обновлено!");
      emit('decorationUpdated');
    } else {
      await axios.post(DECORATIONS_URL, {
        name: newDecoration.name,
        venueId: authStore.selectedVenue._id
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success("Украшение добавлено!");
      emit('decorationAdded');
    }
    
    onClose();
  } catch (e) {
    console.error(e);
    if (e.response?.status === 409) {
      message.warning("Такое украшение уже существует");
    } else {
      message.error("Ошибка при сохранении украшения");
    }
  } finally {
    loading.value = false;
  }
};
</script>
