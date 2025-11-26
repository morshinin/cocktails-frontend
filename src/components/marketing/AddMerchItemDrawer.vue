<template>
  <a-drawer
    :title="isEditing ? 'Редактировать товар' : 'Новый товар'"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form :model="formState" layout="vertical" @finish="onFinish">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item
            label="Название"
            name="name"
            :rules="[{ required: true, message: 'Пожалуйста, введите название' }]"
          >
            <a-input v-model:value="formState.name" placeholder="Название товара" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            label="Цена"
            name="price"
            :rules="[{ required: true, message: 'Укажите цену' }]"
          >
            <a-input-number
              v-model:value="formState.price"
              :min="0"
              style="width: 100%"
              :formatter="value => `₽ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\₽\s?|(,*)/g, '')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Остаток"
            name="stock"
          >
            <a-input-number v-model:value="formState.stock" :min="0" style="width: 100%" />
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
            <a-textarea v-model:value="formState.description" :rows="4" placeholder="Описание товара" />
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
  merch: Object
});

const emit = defineEmits(['update:visible', 'submit']);

const formState = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  imageUrl: ''
});

const isEditing = ref(false);

watch(
  () => props.merch,
  (newVal) => {
    if (newVal) {
      formState.name = newVal.name;
      formState.description = newVal.description;
      formState.price = newVal.price;
      formState.stock = newVal.stock;
      formState.imageUrl = newVal.imageUrl;
      isEditing.value = true;
    } else {
      formState.name = '';
      formState.description = '';
      formState.price = 0;
      formState.stock = 0;
      formState.imageUrl = '';
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
    _id: props.merch?._id
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
