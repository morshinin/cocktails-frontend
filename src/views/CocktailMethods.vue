<template>
  <div>
    <!-- Добавление нового метода -->
    <a-card class="mb-4" title="Добавить новый метод приготовления">
      <a-form layout="vertical" @submit.prevent="addMethod">
        <a-form-item label="Название">
          <a-input
            v-model:value="newMethod.name"
            placeholder="Введите название метода (например: Шейк)"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit">Добавить</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- Список методов -->
    <a-card title="Список методов приготовления">
      <a-list bordered :data-source="methods">
        <template #renderItem="{ item }">
          <a-list-item class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <template v-if="editingId === item._id">
                <a-input
                  v-model:value="editName"
                  size="small"
                  style="width: 200px"
                  @pressEnter="saveEdit(item._id)"
                  @blur="cancelEdit"
                />
                <a-button
                  size="small"
                  type="primary"
                  @click="saveEdit(item._id)"
                >
                  OK
                </a-button>
                <a-button size="small" @click="cancelEdit">Отмена</a-button>
              </template>

              <template v-else>
                <span
                  class="cursor-pointer hover:underline"
                  @click="startEdit(item)"
                >
                  {{ item.name }}
                </span>
              </template>
            </div>

            <a-popconfirm
              title="Удалить метод?"
              ok-text="Да"
              cancel-text="Нет"
              @confirm="deleteMethod(item._id)"
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
import { METHODS_URL} from '../config/api.js';
import { useAuthStore } from '../stores/auth';

const methods = ref([]);
const newMethod = ref({ name: "" });
const editingId = ref(null);
const editName = ref("");

// ===== Загрузка списка =====
const fetchMethods = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;

  try {
    const res = await axios.get(METHODS_URL, {
      params: { venueId: authStore.selectedVenue._id }
    });
    methods.value = res.data || [];
  } catch (e) {
    console.error(e);
    message.error("Не удалось загрузить методы");
  }
};

// ===== Добавление =====
const addMethod = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return message.error("Venue not selected");

  const name = newMethod.value.name.trim();
  if (!name) return message.warning("Введите название");

  const exists = methods.value.some(
    (m) => m.name.toLowerCase() === name.toLowerCase()
  );
  if (exists) return message.warning("Такой метод уже существует");

  try {
    await axios.post(METHODS_URL, { 
      name,
      venueId: authStore.selectedVenue._id 
    });
    message.success("Метод добавлен");
    newMethod.value.name = "";
    await fetchMethods();
  } catch (e) {
    console.error(e);
    if (e.response?.status === 409)
      message.warning("Такой метод уже существует");
    else message.error("Ошибка при добавлении метода");
  }
};

// ===== Удаление =====
const deleteMethod = async (id) => {
  try {
    await axios.delete(`${METHODS_URL}/${id}`);
    message.success("Метод удалён");
    await fetchMethods();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при удалении метода");
  }
};

// ===== Редактирование =====
const startEdit = (item) => {
  editingId.value = item._id;
  editName.value = item.name;
};

const cancelEdit = () => {
  editingId.value = null;
  editName.value = "";
};

const saveEdit = async (id) => {
  const newName = editName.value.trim();
  if (!newName) return message.warning("Введите название");

  const exists = methods.value.some(
    (m) => m._id !== id && m.name.toLowerCase() === newName.toLowerCase()
  );
  if (exists) return message.warning("Такой метод уже существует");

  try {
    await axios.put(`${METHODS_URL}/${id}`, { name: newName });
    message.success("Изменения сохранены");
    cancelEdit();
    await fetchMethods();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при сохранении метода");
  }
};

onMounted(fetchMethods);
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
.cursor-pointer {
  cursor: pointer;
}
.hover\:underline:hover {
  text-decoration: underline;
}
</style>
