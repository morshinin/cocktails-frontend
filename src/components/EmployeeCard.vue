<template>
  <a-badge-ribbon :text="getRoleName(employee.role)" :color="getRoleColor(employee.role)" :style="{ top: '71px' }">
    <a-card class="h-full flex flex-col" :bodyStyle="{ flex: '1', display: 'flex', flexDirection: 'column' }">
      <template #extra>
        <a-dropdown trigger="click">
          <a class="ant-dropdown-link" @click.prevent>
            <MoreOutlined style="font-size: 20px; cursor: pointer" />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a @click="$emit('edit', employee)">
                  <EditOutlined /> Редактировать
                </a>
              </a-menu-item>
              <a-menu-item danger>
                <a-popconfirm
                  title="Удалить этого сотрудника?"
                  ok-text="Да"
                  cancel-text="Нет"
                  @confirm="$emit('delete', employee._id)"
                >
                  <span><DeleteOutlined /> Удалить</span>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
      
      <template #title>
        <div class="flex items-center gap-2">
          <span>{{ employee.name || 'Имя не указано' }}</span>
        </div>
      </template>

      <div class="flex-1">
        <div class="mb-3">
          <img
            :src="employee.image || placeholderImage"
            alt="employee image"
            class="w-full h-48 object-cover rounded"
          />
        </div>

        <div class="flex items-center gap-2 text-gray-600 mb-2">
          <MailOutlined />
          <span class="text-sm">{{ employee.email }}</span>
        </div>
      </div>
    </a-card>
  </a-badge-ribbon>
</template>

<script setup>
import { MoreOutlined, EditOutlined, DeleteOutlined, MailOutlined } from "@ant-design/icons-vue"
import placeholderImage from '../assets/employee_placeholder.png';

defineProps({
  employee: {
    type: Object,
    required: true
  }
})

defineEmits(['delete', 'edit'])

const roleNames = {
  developer: 'Разработчик',
  owner: 'Владелец',
  manager: 'Управляющий',
  head_bartender: 'Старший бармен',
  bartender: 'Бармен',
  head_chef: 'Шеф-повар',
  cook: 'Повар',
  cleaner: 'Клинер',
  waiter: 'Официант',
  guest: 'Гость'
};

const getRoleName = (role) => roleNames[role] || role;

const getRoleColor = (role) => {
  switch (role) {
    case 'developer': return 'purple';
    case 'owner': return 'gold';
    case 'manager': return 'cyan';
    case 'head_bartender': return 'blue';
    case 'bartender': return 'geekblue';
    default: return 'default';
  }
};
</script>
