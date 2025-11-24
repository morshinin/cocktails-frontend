<template>
  <a-drawer
    :title="componentToEdit ? 'Редактировать компонент' : 'Добавить новый компонент'"
    :width="width"
    :open="open"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form layout="vertical" :model="newComponent">
      <a-form-item label="Название" required>
        <a-input v-model:value="newComponent.name" placeholder="Введите название" />
      </a-form-item>

      <a-form-item label="Категория">
        <a-input v-model:value="newComponent.category" placeholder="Например: алкоголь, сироп, сок..." />
      </a-form-item>

      <a-form-item label="Описание">
        <a-textarea v-model:value="newComponent.description" rows="3" placeholder="Введите описание компонента" />
      </a-form-item>

      <a-form-item label="Изображение">
        <input type="file" @change="handleImageUpload" accept="image/*" class="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
        "/>
        <div v-if="previewImage" class="mt-2">
          <img :src="previewImage" class="w-32 h-32 object-cover rounded border" />
        </div>
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="onClose">Отмена</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          {{ componentToEdit ? 'Сохранить' : 'Добавить' }}
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { COMPONENTS_URL, UPLOAD_URL } from '../config/api.js';
import { useAuthStore } from '../stores/auth';

const props = defineProps({
  open: Boolean,
  width: {
    type: [String, Number],
    default: 600
  },
  componentToEdit: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:open', 'componentAdded', 'componentUpdated']);

const loading = ref(false);
const newComponent = reactive({
  name: "",
  category: "",
  description: "",
  image: ""
});
const previewImage = ref(null);

watch(() => props.componentToEdit, (newVal) => {
  if (newVal) {
    newComponent.name = newVal.name;
    newComponent.category = newVal.category;
    newComponent.description = newVal.description;
    newComponent.image = newVal.image;
    previewImage.value = newVal.image;
  } else {
    newComponent.name = "";
    newComponent.category = "";
    newComponent.description = "";
    newComponent.image = "";
    previewImage.value = null;
  }
}, { immediate: true });

const onClose = () => {
  emit('update:open', false);
};

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post(UPLOAD_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    newComponent.image = res.data.url;
    previewImage.value = res.data.url;
    message.success("Изображение загружено!");
  } catch (e) {
    console.error(e);
    message.error("Ошибка при загрузке изображения");
  }
};

const handleSubmit = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return message.error("Venue not selected");
  
  if (!newComponent.name.trim()) {
    return message.warning("Введите название");
  }

  loading.value = true;
  try {
    if (props.componentToEdit) {
      await axios.put(`${COMPONENTS_URL}/${props.componentToEdit._id}`, {
        ...newComponent,
        venueId: authStore.selectedVenue._id
      });
      message.success("Компонент обновлен!");
      emit('componentUpdated');
    } else {
      await axios.post(COMPONENTS_URL, {
        ...newComponent,
        venueId: authStore.selectedVenue._id
      });
      message.success("Компонент добавлен!");
      emit('componentAdded');
    }
    
    onClose();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при сохранении компонента");
  } finally {
    loading.value = false;
  }
};
</script>
