<template>
  <div class="p-6 max-w-4xl mx-auto">
    <a-card :bordered="false" class="shadow-sm">
      <template #title>
        <div class="flex justify-between items-center">
          <span class="text-xl font-bold">Профиль пользователя</span>
          <a-button type="primary" @click="showDrawer = true">
            <template #icon><EditOutlined /></template>
            Редактировать
          </a-button>
        </div>
      </template>

      <div class="flex flex-col md:flex-row gap-8">
        <!-- Avatar Section -->
        <div class="flex flex-col items-center justify-center md:w-1/3">
          <a-avatar :size="120" class="mb-4 bg-green-500 text-4xl">
            {{ authStore.user?.name?.[0]?.toUpperCase() || 'U' }}
          </a-avatar>
          <a-tag :color="getRoleColor(authStore.user?.role)" class="text-lg py-1 px-3">
            {{ getRoleName(authStore.user?.role) }}
          </a-tag>
        </div>

        <!-- Details Section -->
        <div class="flex-1">
          <a-descriptions :column="1" bordered>
            <a-descriptions-item label="Имя">
              {{ authStore.user?.name || 'Не указано' }}
            </a-descriptions-item>
            <a-descriptions-item label="Email">
              {{ authStore.user?.email }}
            </a-descriptions-item>
            <a-descriptions-item label="Организация" v-if="authStore.organization">
              {{ authStore.organization.name }}
            </a-descriptions-item>
            <a-descriptions-item label="Текущее заведение" v-if="authStore.selectedVenue">
              {{ authStore.selectedVenue.name }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
    </a-card>

    <EditProfileDrawer
      v-model:open="showDrawer"
      :user="authStore.user"
      @profileUpdated="authStore.fetchProfile"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { EditOutlined } from '@ant-design/icons-vue';
import EditProfileDrawer from '../../components/User/EditProfileDrawer.vue';

const authStore = useAuthStore();
const showDrawer = ref(false);

const roleNames = {
  developer: 'Разработчик',
  owner: 'Владелец',
  manager: 'Управляющий',
  head_bartender: 'Старший бармен',
  bartender: 'Бармен',
  head_chef: 'Шеф-повар',
  cook: 'Повар',
  cleaner: 'Клинер',
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
