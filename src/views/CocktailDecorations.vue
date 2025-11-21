<template>
  <div>
    <!-- Добавление нового украшения -->
    <a-card class="mb-4" title="Добавить новое украшение">
      <a-form layout="vertical" @submit.prevent="addDecoration">
        <a-form-item label="Название">
          <a-input
            v-model:value="newDecoration.name"
            placeholder="Введите название украшения (например: Долька лимона)"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit">Добавить</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- Список украшений -->
    <a-card title="Список украшений">
      <a-list bordered :data-source="decorations">
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
              title="Удалить украшение?"
              ok-text="Да"
              cancel-text="Нет"
              @confirm="deleteDecoration(item._id)"
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
import { DECORATIONS_URL } from '../config/api.js';
import { useAuthStore } from '../stores/auth';

const decorations = ref([]);
const newDecoration = ref({ name: "" });
const editingId = ref(null);
const editName = ref("");

// ===== Загрузка списка =====
const fetchDecorations = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return;

  try {
    const res = await axios.get(DECORATIONS_URL, {
      params: { venueId: authStore.selectedVenue._id },
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    decorations.value = res.data || [];
  } catch (e) {
    console.error(e);
    message.error("Не удалось загрузить украшения");
  }
};

// ===== Добавление =====
const addDecoration = async () => {
  const authStore = useAuthStore();
  if (!authStore.selectedVenue) return message.error("Venue not selected");

  const name = newDecoration.value.name.trim();
  if (!name) return message.warning("Введите название");

  const exists = decorations.value.some(
    (d) => d.name.toLowerCase() === name.toLowerCase()
  );
  if (exists) return message.warning("Такое украшение уже существует");

  try {
    await axios.post(DECORATIONS_URL, { 
      name,
      venueId: authStore.selectedVenue._id 
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    message.success("Украшение добавлено");
    newDecoration.value.name = "";
    await fetchDecorations();
  } catch (e) {
    console.error(e);
    if (e.response?.status === 409)
      message.warning("Такое украшение уже существует");
    else message.error("Ошибка при добавлении украшения");
  }
};

// ===== Удаление =====
const deleteDecoration = async (id) => {
  const authStore = useAuthStore();
  try {
    await axios.delete(`${DECORATIONS_URL}/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    message.success("Украшение удалено");
    await fetchDecorations();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при удалении украшения");
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

  const exists = decorations.value.some(
    (d) => d._id !== id && d.name.toLowerCase() === newName.toLowerCase()
  );
  if (exists) return message.warning("Такое украшение уже существует");

  try {
    const authStore = useAuthStore();
    await axios.put(`${DECORATIONS_URL}/${id}`, { name: newName }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    message.success("Изменения сохранены");
    cancelEdit();
    await fetchDecorations();
  } catch (e) {
    console.error(e);
    message.error("Ошибка при сохранении украшения");
  }
};

onMounted(fetchDecorations);
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
