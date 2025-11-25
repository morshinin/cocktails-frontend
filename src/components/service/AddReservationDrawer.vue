<template>
  <a-drawer
    :title="isEditing ? 'Редактировать бронь' : 'Новая бронь'"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form :model="formState" layout="vertical" @finish="onFinish">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            label="Имя гостя"
            name="guestName"
            :rules="[{ required: true, message: 'Пожалуйста, введите имя гостя' }]"
          >
            <a-input v-model:value="formState.guestName" placeholder="Имя гостя" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Контакты"
            name="guestContact"
          >
            <a-input v-model:value="formState.guestContact" placeholder="Телефон" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item
            label="Дата"
            name="date"
            :rules="[{ required: true, message: 'Выберите дату' }]"
          >
            <a-date-picker v-model:value="formState.date" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="Время"
            name="time"
            :rules="[{ required: true, message: 'Выберите время' }]"
          >
            <a-time-picker v-model:value="formState.time" format="HH:mm" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="Кол-во гостей"
            name="guestsCount"
            :rules="[{ required: true, message: 'Укажите количество гостей' }]"
          >
            <a-input-number v-model:value="formState.guestsCount" :min="1" style="width: 100%" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            label="Стол №"
            name="tableNumber"
          >
            <a-input v-model:value="formState.tableNumber" placeholder="Номер стола" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Статус"
            name="status"
          >
            <a-select v-model:value="formState.status">
              <a-select-option value="Confirmed">Подтверждено</a-select-option>
              <a-select-option value="Pending">Ожидает</a-select-option>
              <a-select-option value="Seated">Посажены</a-select-option>
              <a-select-option value="Completed">Завершено</a-select-option>
              <a-select-option value="Cancelled">Отменено</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item
            label="Заметки"
            name="notes"
          >
            <a-textarea
              v-model:value="formState.notes"
              :rows="4"
              placeholder="Пожелания, аллергии и т.д."
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
import { reactive, watch, ref } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
  visible: Boolean,
  reservation: Object
});

const emit = defineEmits(['update:visible', 'submit']);

const formState = reactive({
  guestName: '',
  guestContact: '',
  date: dayjs(),
  time: dayjs(),
  guestsCount: 2,
  tableNumber: '',
  status: 'Confirmed',
  notes: ''
});

const isEditing = ref(false);

watch(
  () => props.reservation,
  (newVal) => {
    if (newVal) {
      formState.guestName = newVal.guestName;
      formState.guestContact = newVal.guestContact;
      formState.date = dayjs(newVal.date);
      formState.time = dayjs(newVal.date).hour(parseInt(newVal.time.split(':')[0])).minute(parseInt(newVal.time.split(':')[1]));
      formState.guestsCount = newVal.guestsCount;
      formState.tableNumber = newVal.tableNumber;
      formState.status = newVal.status;
      formState.notes = newVal.notes;
      isEditing.value = true;
    } else {
      formState.guestName = '';
      formState.guestContact = '';
      formState.date = dayjs();
      formState.time = dayjs();
      formState.guestsCount = 2;
      formState.tableNumber = '';
      formState.status = 'Confirmed';
      formState.notes = '';
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
    date: formState.date.format('YYYY-MM-DD'),
    time: formState.time.format('HH:mm'),
    _id: props.reservation?._id
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
