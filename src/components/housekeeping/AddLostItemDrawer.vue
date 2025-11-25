<template>
  <a-drawer
    :title="isEditing ? 'Редактировать запись' : 'Добавить потеряшку'"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form :model="formState" layout="vertical" @finish="onFinish">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            label="Название предмета"
            name="name"
            :rules="[{ required: true, message: 'Пожалуйста, введите название' }]"
          >
            <a-input v-model:value="formState.name" placeholder="Что найдено?" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Статус"
            name="status"
          >
            <a-select v-model:value="formState.status" placeholder="Выберите статус">
              <a-select-option value="Waiting">Ожидает</a-select-option>
              <a-select-option value="Returned">Возвращена</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            label="Кто нашел"
            name="finderName"
          >
            <a-input v-model:value="formState.finderName" placeholder="Имя сотрудника" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Контакты владельца"
            name="ownerContact"
          >
            <a-input v-model:value="formState.ownerContact" placeholder="Телефон или имя (если известно)" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item
            label="Описание"
            name="description"
          >
            <a-textarea
              v-model:value="formState.description"
              :rows="4"
              placeholder="Где найдено, особые приметы..."
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Фотография">
            <div class="flex gap-4 items-center">
              <input type="file" accept="image/*" @change="onImageChange" />
              <div v-if="formState.imageUrl">
                <img :src="formState.imageUrl" alt="Preview" class="w-24 h-24 object-cover rounded" />
              </div>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
      
      <div class="drawer-footer">
        <a-space>
          <a-button @click="onClose">Отмена</a-button>
          <a-button type="primary" html-type="submit">Сохранить</a-button>
        </a-space>
      </div>
    </a-form>
  </a-drawer>
</template>

<script setup>
import { reactive, watch, ref } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { UPLOAD_URL } from '../../config/api';

const props = defineProps({
  visible: Boolean,
  item: Object
});

const emit = defineEmits(['update:visible', 'submit']);

const formState = reactive({
  name: '',
  description: '',
  status: 'Waiting',
  finderName: '',
  ownerContact: '',
  imageUrl: ''
});

const isEditing = ref(false);

watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      formState.name = newItem.name;
      formState.description = newItem.description;
      formState.status = newItem.status;
      formState.finderName = newItem.finderName;
      formState.ownerContact = newItem.ownerContact;
      formState.imageUrl = newItem.imageUrl;
      isEditing.value = true;
    } else {
      formState.name = '';
      formState.description = '';
      formState.status = 'Waiting';
      formState.finderName = '';
      formState.ownerContact = '';
      formState.imageUrl = '';
      isEditing.value = false;
    }
  },
  { immediate: true }
);

const onImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post(UPLOAD_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    formState.imageUrl = res.data.url;
    message.success("Изображение загружено!");
  } catch (err) {
    console.error(err);
    message.error("Ошибка при загрузке изображения");
  }
};

const onClose = () => {
  emit('update:visible', false);
};

const onFinish = () => {
  emit('submit', { ...formState, _id: props.item?._id });
  onClose();
};
</script>

<style scoped>
.drawer-footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: right;
  z-index: 1;
}
</style>
