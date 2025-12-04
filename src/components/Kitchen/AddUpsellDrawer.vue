<template>
  <a-drawer
    :title="upsellToEdit ? 'Редактировать доп. продажу' : 'Добавить новую доп. продажу'"
    :width="width"
    :open="open"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form layout="vertical" :model="newUpsell">
      <a-form-item label="Название" required>
        <a-input v-model:value="newUpsell.name" placeholder="Введите название (например: Соус)" />
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="onClose">Отмена</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          {{ upsellToEdit ? 'Сохранить' : 'Добавить' }}
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
  upsellToEdit: {
    type: Object,
    default: null
  },
  apiUrl: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:open', 'upsellAdded', 'upsellUpdated']);

const loading = ref(false);
const newUpsell = reactive({
  name: ""
});

watch(() => props.upsellToEdit, (newVal) => {
  if (newVal) {
    newUpsell.name = newVal.name;
  } else {
    newUpsell.name = "";
  }
}, { immediate: true });

const onClose = () => {
  emit('update:open', false);
};

const handleSubmit = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return message.error("Venue not selected");
  
  if (!newUpsell.name.trim()) {
    return message.warning("Введите название");
  }

  loading.value = true;
  try {
    if (props.upsellToEdit) {
      await axios.put(`${props.apiUrl}/${props.upsellToEdit._id}`, {
        name: newUpsell.name
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success("Доп. продажа обновлена!");
      emit('upsellUpdated');
    } else {
      await axios.post(props.apiUrl, {
        name: newUpsell.name,
        venueId: authStore.selectedVenue._id
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      message.success("Доп. продажа добавлена!");
      emit('upsellAdded');
    }
    
    onClose();
  } catch (e) {
    console.error(e);
    if (e.response?.status === 409) {
      message.warning("Такая доп. продажа уже существует");
    } else {
      message.error("Ошибка при сохранении доп. продажи");
    }
  } finally {
    loading.value = false;
  }
};
</script>
