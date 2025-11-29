<template>
  <a-drawer
    :title="isEditing ? 'Редактировать гостя' : 'Новый гость'"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form :model="formState" layout="vertical" @finish="onFinish">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            label="Имя"
            name="name"
            :rules="[{ required: true, message: 'Пожалуйста, введите имя' }]"
          >
            <a-input v-model:value="formState.name" placeholder="Имя гостя" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="День рождения"
            name="birthday"
          >
            <a-date-picker v-model:value="formState.birthday" style="width: 100%" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Фото URL" name="imageUrl">
            <a-input v-model:value="formState.imageUrl" placeholder="https://example.com/photo.jpg" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-divider>Контакты</a-divider>

      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item label="Телефон" name="phone">
            <a-input v-model:value="formState.contacts.phone" placeholder="+7..." />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="Email" name="email">
            <a-input v-model:value="formState.contacts.email" placeholder="email@example.com" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="Telegram" name="telegram">
            <a-input v-model:value="formState.contacts.telegram" placeholder="@username" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-divider>Информация</a-divider>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Предпочтения" name="preferences">
            <a-textarea v-model:value="formState.preferences" :rows="3" placeholder="Любимые напитки, столик и т.д." />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Заметки" name="description">
            <a-textarea v-model:value="formState.description" :rows="3" placeholder="Дополнительная информация" />
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
import dayjs from 'dayjs';

const props = defineProps({
  visible: Boolean,
  guest: Object
});

const emit = defineEmits(['update:visible', 'submit']);

const formState = reactive({
  name: '',
  birthday: null,
  imageUrl: '',
  contacts: {
    phone: '',
    email: '',
    telegram: ''
  },
  preferences: '',
  description: ''
});

const isEditing = ref(false);

watch(
  () => props.guest,
  (newVal) => {
    if (newVal) {
      formState.name = newVal.name;
      formState.birthday = newVal.birthday ? dayjs(newVal.birthday) : null;
      formState.imageUrl = newVal.imageUrl;
      formState.contacts = { ...newVal.contacts };
      formState.preferences = newVal.preferences;
      formState.description = newVal.description;
      isEditing.value = true;
    } else {
      formState.name = '';
      formState.birthday = null;
      formState.imageUrl = '';
      formState.contacts = { phone: '', email: '', telegram: '' };
      formState.preferences = '';
      formState.description = '';
      isEditing.value = false;
    }
  },
  { immediate: true }
);

const onClose = () => {
  emit('update:visible', false);
};

const onFinish = () => {
  const payload = {
    ...formState,
    birthday: formState.birthday ? formState.birthday.toISOString() : null,
    _id: props.guest?._id
  };
  emit('submit', payload);
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
