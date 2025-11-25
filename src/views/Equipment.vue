<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">Оборудование</h1>
      <a-button type="primary" @click="showDrawer">
        <template #icon><PlusOutlined /></template>
        Добавить оборудование
      </a-button>
    </div>

    <a-table :columns="columns" :data-source="equipmentList" :row-key="record => record._id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">
            {{ record.status }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'zone'">
          {{ record.zoneId?.name || '-' }}
        </template>
        <template v-else-if="column.key === 'price'">
          {{ record.price ? `$${record.price}` : '-' }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a @click="editEquipment(record)">Редактировать</a>
            <a-popconfirm title="Вы уверены?" @confirm="deleteEquipment(record._id)">
              <a class="text-red-500">Удалить</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <AddEquipmentDrawer
      v-model:visible="drawerVisible"
      :equipment="editingEquipment"
      @submit="handleDrawerSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import AddEquipmentDrawer from '../components/housekeeping/AddEquipmentDrawer.vue';

const equipmentList = ref([]);
const drawerVisible = ref(false);
const editingEquipment = ref(null);

const columns = [
  {
    title: 'Название',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Зона',
    key: 'zone',
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Цена',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Действия',
    key: 'action',
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Working': return 'green';
    case 'Broken': return 'red';
    case 'Maintenance': return 'orange';
    default: return 'default';
  }
};

const fetchEquipment = async () => {
  try {
    const response = await axios.get('/api/housekeeping/equipment');
    equipmentList.value = response.data;
  } catch (error) {
    console.error('Error fetching equipment:', error);
    message.error('Не удалось загрузить оборудование');
  }
};

const showDrawer = () => {
  editingEquipment.value = null;
  drawerVisible.value = true;
};

const editEquipment = (equipment) => {
  editingEquipment.value = equipment;
  drawerVisible.value = true;
};

const deleteEquipment = async (id) => {
  try {
    await axios.delete(`/api/housekeeping/equipment/${id}`);
    message.success('Оборудование удалено');
    fetchEquipment();
  } catch (error) {
    console.error('Error deleting equipment:', error);
    message.error('Не удалось удалить оборудование');
  }
};

const handleDrawerSubmit = async (formData) => {
  try {
    if (formData._id) {
      await axios.put(`/api/housekeeping/equipment/${formData._id}`, formData);
      message.success('Оборудование обновлено');
    } else {
      await axios.post('/api/housekeeping/equipment', formData);
      message.success('Оборудование создано');
    }
    fetchEquipment();
  } catch (error) {
    console.error('Error saving equipment:', error);
    message.error('Не удалось сохранить оборудование');
  }
};

onMounted(() => {
  fetchEquipment();
});
</script>
