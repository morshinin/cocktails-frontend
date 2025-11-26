<template>
  <a-drawer
    :title="isEditing ? 'Редактировать DJ' : 'Новый DJ'"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form :model="formState" layout="vertical" @finish="onFinish">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            label="Имя / Псевдоним"
            name="name"
            :rules="[{ required: true, message: 'Пожалуйста, введите имя' }]"
          >
            <a-input v-model:value="formState.name" placeholder="DJ Name" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Жанр"
            name="genre"
          >
            <a-input v-model:value="formState.genre" placeholder="House, Techno, etc." />
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

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Описание" name="description">
            <a-textarea v-model:value="formState.description" :rows="4" placeholder="Описание стиля, опыт и т.д." />
          </a-form-item>
        </a-col>
      </a-row>

      <a-divider>Контакты и Соцсети</a-divider>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Телефон" name="phone">
            <a-input v-model:value="formState.contacts.phone" placeholder="+7..." />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Email" name="email">
            <a-input v-model:value="formState.contacts.email" placeholder="email@example.com" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item label="Instagram" name="instagram">
            <a-input v-model:value="formState.socialLinks.instagram" placeholder="@username" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="SoundCloud" name="soundcloud">
            <a-input v-model:value="formState.socialLinks.soundcloud" placeholder="SoundCloud URL" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="Telegram" name="telegram">
            <a-input v-model:value="formState.socialLinks.telegram" placeholder="@username" />
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

const props = defineProps({
  visible: Boolean,
  dj: Object
});

const emit = defineEmits(['update:visible', 'submit']);

const formState = reactive({
  name: '',
  genre: '',
  description: '',
  imageUrl: '',
  contacts: {
    phone: '',
    email: ''
  },
  socialLinks: {
    instagram: '',
    soundcloud: '',
    telegram: ''
  }
});

const isEditing = ref(false);

watch(
  () => props.dj,
  (newVal) => {
    if (newVal) {
      formState.name = newVal.name;
      formState.genre = newVal.genre;
      formState.description = newVal.description;
      formState.imageUrl = newVal.imageUrl;
      formState.contacts = { ...newVal.contacts };
      formState.socialLinks = { ...newVal.socialLinks };
      isEditing.value = true;
    } else {
      formState.name = '';
      formState.genre = '';
      formState.description = '';
      formState.imageUrl = '';
      formState.contacts = { phone: '', email: '' };
      formState.socialLinks = { instagram: '', soundcloud: '', telegram: '' };
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
    _id: props.dj?._id
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
