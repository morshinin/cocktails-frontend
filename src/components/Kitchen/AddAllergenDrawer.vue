<template>
  <a-drawer
    :title="allergenToEdit ? 'Редактировать аллерген' : 'Добавить новый аллерген'"
    :width="width"
    :open="open"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form layout="vertical" :model="newAllergen">
      <a-form-item label="Название" required>
        <a-input v-model:value="newAllergen.name" placeholder="Введите название аллергена (например: Глютен)" />
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="onClose">Отмена</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          {{ allergenToEdit ? 'Сохранить' : 'Добавить' }}
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
  allergenToEdit: {
    type: Object,
    default: null
  },
  apiUrl: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:open', 'allergenAdded', 'allergenUpdated']);

const loading = ref(false);
const newAllergen = reactive({
  name: ""
});

watch(() => props.allergenToEdit, (newVal) => {
  if (newVal) {
    newAllergen.name = newVal.name;
  } else {
    newAllergen.name = "";
  }
}, { immediate: true });

const onClose = () => {
  emit('update:open', false);
};

const handleSubmit = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return message.error("Venue not selected");
  
  if (!newAllergen.name.trim()) {
    return message.warning("Введите название");
  }

  loading.value = true;
  try {
    if (props.allergenToEdit) {
      await axios.put(`${props.apiUrl}/${props.allergenToEdit._id}`, {
        name: newAllergen.name
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success("Аллерген обновлен!");
      emit('allergenUpdated');
    } else {
      await axios.post(props.apiUrl, {
        name: newAllergen.name,
        venueId: authStore.selectedVenue._id
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success("Аллерген добавлен!");
      emit('allergenAdded');
    }
    
    onClose();
  } catch (e) {
    console.error(e);
    if (e.response?.status === 409) {
      message.warning("Такой аллерген уже существует");
    } else {
      message.error("Ошибка при сохранении аллергена");
    }
  } finally {
    loading.value = false;
  }
};
</script>
