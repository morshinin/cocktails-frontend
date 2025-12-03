<template>
  <a-drawer
    :visible="visible"
    :title="isEditing ? 'Редактировать барную стойку' : '➕ Новая барная стойка'"
    @close="onClose"
    :width="isMobile ? '100%' : '600px'"
    placement="right"
  >
    <a-form layout="vertical" class="pb-16">
      <!-- Название -->
      <a-form-item label="Название" required>
        <a-input v-model:value="formData.name" placeholder="Введите название" />
      </a-form-item>

      <!-- Описание -->
      <a-form-item label="Описание">
        <a-textarea
          v-model:value="formData.description"
          rows="3"
          placeholder="Описание барной стойки"
        />
      </a-form-item>

      <!-- Расположение -->
      <a-form-item label="Расположение">
        <a-input v-model:value="formData.location" placeholder="Например: Главный зал, 1 этаж" />
      </a-form-item>

      <!-- Вместимость -->
      <a-form-item label="Вместимость (мест)">
        <a-input-number
          v-model:value="formData.capacity"
          :min="0"
          placeholder="Количество мест"
          style="width: 100%"
        />
      </a-form-item>

      <!-- Статус -->
      <a-form-item label="Статус">
        <a-select
          v-model:value="formData.status"
          placeholder="Выберите статус"
        >
          <a-select-option value="Active">Активна</a-select-option>
          <a-select-option value="Inactive">Неактивна</a-select-option>
          <a-select-option value="Maintenance">На обслуживании</a-select-option>
        </a-select>
      </a-form-item>

      <!-- URL изображения -->
      <a-form-item label="URL изображения">
        <a-input v-model:value="formData.imageUrl" placeholder="https://example.com/image.jpg" />
      </a-form-item>
    </a-form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <a-button @click="onClose">Отмена</a-button>
        <a-button type="primary" @click="onSubmit">
          {{ isEditing ? 'Сохранить' : 'Добавить' }}
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { message } from "ant-design-vue";

const props = defineProps({
  visible: Boolean,
  counter: Object
});

const emit = defineEmits(['update:visible', 'submit']);

const isMobile = ref(window.innerWidth < 640);
const isEditing = ref(false);

const initialFormData = {
  name: "",
  description: "",
  location: "",
  capacity: null,
  status: "Active",
  imageUrl: ""
};

const formData = ref({ ...initialFormData });

const handleResize = () => {
  isMobile.value = window.innerWidth < 640;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Watch for counter prop changes (editing mode)
watch(() => props.counter, (newVal) => {
  if (newVal) {
    formData.value = { ...newVal };
    isEditing.value = true;
  } else {
    formData.value = { ...initialFormData };
    isEditing.value = false;
  }
}, { immediate: true });

// Reset form when drawer opens
watch(() => props.visible, (val) => {
  if (val && !props.counter) {
    formData.value = { ...initialFormData };
    isEditing.value = false;
  }
});

const onClose = () => {
  emit('update:visible', false);
};

const onSubmit = () => {
  if (!formData.value.name) {
    return message.warning("Введите название");
  }

  emit('submit', { ...formData.value });
  onClose();
};
</script>
