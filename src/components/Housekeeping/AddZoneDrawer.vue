<template>
  <a-drawer
    :title="isEditing ? 'Редактировать зону' : 'Добавить зону'"
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
            :rules="[{ required: true, message: 'Пожалуйста, введите название зоны' }]"
          >
            <a-input v-model:value="formState.name" placeholder="Введите название зоны" />
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
              placeholder="Введите описание зоны"
            />
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
import { reactive, watch, toRefs, ref } from 'vue';

const props = defineProps({
  visible: Boolean,
  zone: Object
});

const emit = defineEmits(['update:visible', 'submit']);

const formState = reactive({
  name: '',
  description: ''
});

const isEditing = ref(false);

watch(
  () => props.zone,
  (newZone) => {
    if (newZone) {
      formState.name = newZone.name;
      formState.description = newZone.description;
      isEditing.value = true;
    } else {
      formState.name = '';
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
  emit('submit', { ...formState, _id: props.zone?._id });
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
