<template>
  <div>
    <!-- Добавление нового бокала -->
    <a-card class="mb-4" title="Добавить новый бокал">
      <a-form layout="vertical" @submit.prevent="addGlass">
        <a-form-item label="Название">
          <a-input
            v-model:value="newGlass.name"
            placeholder="Введите название бокала (например: Хайбол)"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit">Добавить</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- Список бокалов -->
    <a-card title="Список бокалов">
      <a-list bordered :data-source="glasses">
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
              title="Удалить бокал?"
              ok-text="Да"
              cancel-text="Нет"
              @confirm="deleteGlass(item._id)"
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
import { GLASSES_URL } from '../config/api.js';
import { useAuthStore } from '../stores/auth';

const glasses = ref([]);
const newGlass = ref({ name: "" });
const editingId = ref(null);
const editName = ref("");

// ===== Загрузка списка =====
const fetchGlasses = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;

  try {
    const res = await axios.get(GLASSES_URL, {
      params: { venueId: authStore.selectedVenue._id },
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    glasses.value = res.data || [];
  } catch (e) {
    console.error(e);
    message.error("Не удалось загрузить бокалы");
  }
};

// ===== Добавление =====
const addGlass = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return message.error("Venue not selected");

  const name = newGlass.value.name.trim();
  if (!name) return message.warning("Введите название");

  const exists = glasses.value.some(
    (g) => g.name.toLowerCase() === name.toLowerCase()
  );
  if (exists) return message.warning("Такой бокал уже существует");

  try {
    await axios.post(GLASSES_URL, { 
      name,
      venueId: authStore.selectedVenue._id 
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    message.success("Бокал добавлен");
    newGlass.value.name = "";
    await fetchGlasses();
  } catch (e) {
    console.error(e);
    if (e.response?.status === 409)
      message.warning("Такой бокал уже существует");
    else message.error("Ошибка при добавлении бокала");
  }
};

// ===== Удаление =====
const deleteGlass = async (id) => {
  const authStore = useAuthStore();
  try {
    await axios.delete(`${GLASSES_URL}/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    message.success("Бокал удалён");
    await fetchGlasses();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при удалении бокала");
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

  const exists = glasses.value.some(
    (g) => g._id !== id && g.name.toLowerCase() === newName.toLowerCase()
  );
  if (exists) return message.warning("Такой бокал уже существует");

  try {
    const authStore = useAuthStore();
    await axios.put(`${GLASSES_URL}/${id}`, { name: newName }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    message.success("Изменения сохранены");
    cancelEdit();
    await fetchGlasses();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при сохранении бокала");
  }
};

onMounted(fetchGlasses);
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
