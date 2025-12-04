<template>
  <a-drawer
    title="Добавить блюдо"
    :width="600"
    :open="open"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form layout="vertical" :model="formState">
      <a-form-item label="Название" required>
        <a-input v-model:value="formState.name" placeholder="Название блюда" />
      </a-form-item>
      
      <a-form-item label="Описание">
        <a-textarea v-model:value="formState.description" placeholder="Описание блюда" :rows="4" />
      </a-form-item>

      <a-form-item label="Категория">
        <a-select
          v-model:value="formState.category"
          placeholder="Выберите категорию"
          :options="categories.map(c => ({ label: c.name, value: c.name }))"
        />
      </a-form-item>

      <a-form-item label="Метод приготовления">
        <a-select
          v-model:value="formState.method"
          placeholder="Выберите метод"
          :options="methods.map(m => ({ label: m.name, value: m.name }))"
        />
      </a-form-item>

      <a-form-item label="Аллергены">
        <a-select
          v-model:value="formState.allergens"
          mode="multiple"
          placeholder="Выберите аллергены"
          :options="allergens.map(a => ({ label: a.name, value: a.name }))"
        />
      </a-form-item>

      <a-form-item label="Доп. продажа">
        <a-select
          v-model:value="formState.upsells"
          mode="multiple"
          placeholder="Выберите доп. продажи"
          :options="upsells.map(u => ({ label: u.name, value: u.name }))"
        />
      </a-form-item>

      <a-form-item label="Примечания">
        <a-textarea v-model:value="formState.notes" placeholder="Дополнительные примечания" :rows="3" />
      </a-form-item>

      <a-form-item label="Пейринг">
        <a-input v-model:value="formState.pairing" placeholder="Рекомендуемые напитки" />
      </a-form-item>

      <a-form-item label="Изображение">
        <div class="flex gap-4 items-center">
          <input type="file" accept="image/*" @change="onImageChange" />

          <div v-if="formState.image">
            <img :src="formState.image" alt="Preview" class="w-24 h-24 object-cover rounded" />
          </div>
        </div>
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="onClose">Отмена</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          Создать
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { useAuthStore } from '../../stores/auth';
import { DISH_CATEGORIES_URL, KITCHEN_METHODS_URL, ALLERGENS_URL, UPSELLS_URL, UPLOAD_URL } from '../../config/api.js';

const props = defineProps({
  open: Boolean
});

const emit = defineEmits(['update:open', 'dishAdded']);

const loading = ref(false);
const categories = ref([]);
const methods = ref([]);
const allergens = ref([]);
const upsells = ref([]);

const formState = reactive({
  name: '',
  description: '',
  category: '',
  method: '',
  allergens: [],
  upsells: [],
  notes: '',
  pairing: '',
  image: ''
});

const fetchCategories = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;
  
  try {
    const res = await axios.get(DISH_CATEGORIES_URL, {
      params: { venueId: authStore.selectedVenue._id },
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    categories.value = res.data || [];
  } catch (e) {
    console.error(e);
  }
};

const fetchMethods = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;
  
  try {
    const res = await axios.get(KITCHEN_METHODS_URL, {
      params: { venueId: authStore.selectedVenue._id },
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    methods.value = res.data || [];
  } catch (e) {
    console.error(e);
  }
};

const fetchAllergens = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;
  
  try {
    const res = await axios.get(ALLERGENS_URL, {
      params: { venueId: authStore.selectedVenue._id },
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    allergens.value = res.data || [];
  } catch (e) {
    console.error(e);
  }
};

const fetchUpsells = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;
  
  try {
    const res = await axios.get(UPSELLS_URL, {
      params: { venueId: authStore.selectedVenue._id },
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    upsells.value = res.data || [];
  } catch (e) {
    console.error(e);
  }
};

const onImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post(UPLOAD_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    formState.image = res.data.url;
    message.success("Изображение загружено!");
  } catch (err) {
    console.error(err);
    message.error("Ошибка при загрузке изображения");
  }
};

const onClose = () => {
  emit('update:open', false);
};

const handleSubmit = async () => {
  const authStore = useAuthStore();
  
  if (!formState.name) {
    return message.warning("Введите название блюда");
  }

  loading.value = true;
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    await axios.post(`${API_URL}/dishes`, {
      ...formState,
      venueId: authStore.selectedVenue._id
    });
    message.success("Блюдо создано!");
    
    // Reset form
    formState.name = '';
    formState.description = '';
    formState.category = '';
    formState.method = '';
    formState.allergens = [];
    formState.upsells = [];
    formState.notes = '';
    formState.pairing = '';
    formState.image = '';
    
    emit('dishAdded');
    onClose();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при создании блюда");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchMethods(), fetchAllergens(), fetchUpsells()]);
});
</script>
