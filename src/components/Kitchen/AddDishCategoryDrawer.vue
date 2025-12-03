<template>
  <a-drawer
    :title="categoryToEdit ? 'Редактировать категорию' : 'Добавить новую категорию'"
    :width="width"
    :open="open"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form layout="vertical" :model="newCategory">
      <a-form-item label="Название" required>
        <a-input v-model:value="newCategory.name" placeholder="Введите название категории (например: Салаты)" />
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="onClose">Отмена</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          {{ categoryToEdit ? 'Сохранить' : 'Добавить' }}
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
  categoryToEdit: {
    type: Object,
    default: null
  },
  apiUrl: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:open', 'categoryAdded', 'categoryUpdated']);

const loading = ref(false);
const newCategory = reactive({
  name: ""
});

watch(() => props.categoryToEdit, (newVal) => {
  if (newVal) {
    newCategory.name = newVal.name;
  } else {
    newCategory.name = "";
  }
}, { immediate: true });

const onClose = () => {
  emit('update:open', false);
};

const handleSubmit = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return message.error("Venue not selected");
  
  if (!newCategory.name.trim()) {
    return message.warning("Введите название");
  }

  loading.value = true;
  try {
    if (props.categoryToEdit) {
      await axios.put(`${props.apiUrl}/${props.categoryToEdit._id}`, {
        name: newCategory.name
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success("Категория обновлена!");
      emit('categoryUpdated');
    } else {
      await axios.post(props.apiUrl, {
        name: newCategory.name,
        venueId: authStore.selectedVenue._id
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success("Категория добавлена!");
      emit('categoryAdded');
    }
    
    onClose();
  } catch (e) {
    console.error(e);
    if (e.response?.status === 409) {
      message.warning("Такая категория уже существует");
    } else {
      message.error("Ошибка при сохранении категории");
    }
  } finally {
    loading.value = false;
  }
};
</script>
