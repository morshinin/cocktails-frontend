<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Категории компонентов</h1>
      <a-button type="primary" @click="handleAdd">
        <template #icon><PlusOutlined /></template>
        Добавить категорию
      </a-button>
    </div>

    <a-table :columns="columns" :data-source="categories" :loading="loading" row-key="_id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" @click="handleEdit(record)">Редактировать</a-button>
            <a-popconfirm
              title="Удалить категорию?"
              ok-text="Да"
              cancel-text="Нет"
              @confirm="deleteCategory(record._id)"
            >
              <a-button type="link" danger>Удалить</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="showModal"
      :title="editingCategory ? 'Редактировать категорию' : 'Добавить категорию'"
      @ok="handleSubmit"
      :confirmLoading="submitting"
    >
      <a-form layout="vertical">
        <a-form-item label="Название" required>
          <a-input v-model:value="formState.name" placeholder="Введите название категории" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { CATEGORIES_URL } from '../config/api.js';
import { useAuthStore } from '../stores/auth';

const categories = ref([]);
const loading = ref(false);
const showModal = ref(false);
const submitting = ref(false);
const editingCategory = ref(null);

const formState = reactive({
  name: ''
});

const columns = [
  {
    title: 'Название',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Действия',
    key: 'action',
    width: 200,
  },
];

const fetchCategories = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;

  loading.value = true;
  try {
    const res = await axios.get(CATEGORIES_URL, {
      params: { venueId: authStore.selectedVenue._id }
    });
    categories.value = res.data;
  } catch (e) {
    console.error(e);
    message.error("Ошибка при загрузке категорий");
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  editingCategory.value = null;
  formState.name = '';
  showModal.value = true;
};

const handleEdit = (record) => {
  editingCategory.value = record;
  formState.name = record.name;
  showModal.value = true;
};

const handleSubmit = async () => {
  if (!formState.name.trim()) {
    return message.warning("Введите название");
  }

  const authStore = useAuthStore();
  submitting.value = true;

  try {
    if (editingCategory.value) {
      await axios.put(`${CATEGORIES_URL}/${editingCategory.value._id}`, {
        name: formState.name
      });
      message.success("Категория обновлена");
    } else {
      await axios.post(CATEGORIES_URL, {
        name: formState.name,
        venueId: authStore.selectedVenue._id
      });
      message.success("Категория добавлена");
    }
    showModal.value = false;
    fetchCategories();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при сохранении");
  } finally {
    submitting.value = false;
  }
};

const deleteCategory = async (id) => {
  try {
    await axios.delete(`${CATEGORIES_URL}/${id}`);
    message.success("Категория удалена");
    fetchCategories();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при удалении");
  }
};

onMounted(() => {
  fetchCategories();
});
</script>
