<template>
  <div>
    <!-- Добавление нового компонента -->
    <a-card class="mb-4" title="Добавить новый компонент">
      <a-form layout="vertical" @submit.prevent="addComponent">
        <a-form-item label="Название">
          <a-input v-model:value="newComponent.name" placeholder="Введите название" />
        </a-form-item>

        <a-form-item label="Категория">
          <a-input v-model:value="newComponent.category" placeholder="Например: алкоголь, сироп, сок..." />
        </a-form-item>

        <a-form-item label="Описание">
          <a-textarea v-model:value="newComponent.description" rows="3" placeholder="Введите описание компонента" />
        </a-form-item>

        <a-form-item label="Изображение">
          <input type="file" @change="handleImageUpload" accept="image/*" />
          <div v-if="previewImage" class="mt-2">
            <img :src="previewImage" class="w-32 h-32 object-cover rounded border" />
          </div>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit">Добавить</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- Список компонентов -->
    <a-card title="Список компонентов">
      <a-list bordered :data-source="components">
        <template #renderItem="{ item }">
          <a-list-item class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <router-link
                :to="`/components/${item._id}`"
                class="cursor-pointer hover:underline"
              >
                {{ item.name }}
              </router-link>
            </div>


            <a-popconfirm
              title="Удалить компонент?"
              ok-text="Да"
              cancel-text="Нет"
              @confirm="deleteComponent(item._id)"
            >
              <a-button type="text" danger>
                <DeleteOutlined />
              </a-button>
            </a-popconfirm>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { DeleteOutlined } from "@ant-design/icons-vue";
import { COMPONENTS_URL, UPLOAD_URL } from '../config/api.js';
import { useAuthStore } from '../stores/auth';

const components = ref([]);
const newComponent = ref({ name: "", category: "", description: "", image: "" });
const previewImage = ref(null);

// === Загрузка списка ===
const fetchComponents = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;

  const res = await axios.get(COMPONENTS_URL, {
    params: { venueId: authStore.selectedVenue._id }
  });
  components.value = res.data;
};

// === Загрузка изображения ===
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post(UPLOAD_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    newComponent.value.image = res.data.url;
    previewImage.value = res.data.url;
    message.success("Изображение загружено!");
  } catch (e) {
    console.error(e);
    message.error("Ошибка при загрузке изображения");
  }
};

// === Добавление нового компонента ===
const addComponent = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return message.error("Venue not selected");

  const { name, category, description, image } = newComponent.value;
  if (!name.trim()) return message.warning("Введите название");

  try {
    await axios.post(COMPONENTS_URL, { 
      name, 
      category, 
      description, 
      image,
      venueId: authStore.selectedVenue._id 
    });
    message.success("Компонент добавлен!");
    newComponent.value = { name: "", category: "", description: "", image: "" };
    previewImage.value = null;
    await fetchComponents();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при добавлении компонента");
  }
};

// === Удаление ===
const deleteComponent = async (id) => {
  try {
    await axios.delete(`${COMPONENTS_URL}/${id}`);
    message.success("Компонент удалён");
    await fetchComponents();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при удалении");
  }
};

onMounted(fetchComponents);
</script>
