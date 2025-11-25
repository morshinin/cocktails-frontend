<template>
  <a-drawer
    :title="isEditing ? 'Редактировать оборудование' : 'Добавить оборудование'"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form :model="formState" layout="vertical" @finish="onFinish">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            label="Название"
            name="name"
            :rules="[{ required: true, message: 'Пожалуйста, введите название' }]"
          >
            <a-input v-model:value="formState.name" placeholder="Введите название" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Статус"
            name="status"
            :rules="[{ required: true, message: 'Пожалуйста, выберите статус' }]"
          >
            <a-select v-model:value="formState.status" placeholder="Выберите статус">
              <a-select-option value="Working">Working</a-select-option>
              <a-select-option value="Broken">Broken</a-select-option>
              <a-select-option value="Maintenance">Maintenance</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            label="Зона"
            name="zoneId"
          >
            <a-select v-model:value="formState.zoneId" placeholder="Выберите зону">
              <a-select-option v-for="zone in zones" :key="zone._id" :value="zone._id">
                {{ zone.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Цена"
            name="price"
          >
            <a-input-number
              v-model:value="formState.price"
              style="width: 100%"
              :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\$\s?|(,*)/g, '')"
            />
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
              placeholder="Введите описание"
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
import { reactive, watch, ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  visible: Boolean,
  equipment: Object
});

const emit = defineEmits(['update:visible', 'submit']);

const formState = reactive({
  name: '',
  description: '',
  zoneId: undefined,
  status: 'Working',
  price: 0
});

const zones = ref([]);
const isEditing = ref(false);

const fetchZones = async () => {
  try {
    const response = await axios.get('/api/housekeeping/zones');
    zones.value = response.data;
  } catch (error) {
    console.error('Error fetching zones:', error);
  }
};

watch(
  () => props.equipment,
  (newEquipment) => {
    if (newEquipment) {
      formState.name = newEquipment.name;
      formState.description = newEquipment.description;
      formState.zoneId = newEquipment.zoneId?._id || newEquipment.zoneId;
      formState.status = newEquipment.status;
      formState.price = newEquipment.price;
      isEditing.value = true;
    } else {
      formState.name = '';
      formState.description = '';
      formState.zoneId = undefined;
      formState.status = 'Working';
      formState.price = 0;
      isEditing.value = false;
    }
  },
  { immediate: true }
);

onMounted(() => {
  fetchZones();
});

const onClose = () => {
  emit('update:visible', false);
};

const onFinish = () => {
  emit('submit', { ...formState, _id: props.equipment?._id });
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
