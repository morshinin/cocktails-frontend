<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Управление персоналом</h1>
    
    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :sm="12" :md="8" v-for="item in menuItems" :key="item.path">
        <router-link :to="item.path" class="block h-full">
          <a-card hoverable class="h-full transition-transform hover:-translate-y-1">
            <template #cover>
              <div class="h-32 bg-gray-100 flex items-center justify-center text-4xl text-gray-400">
                <component :is="item.icon" />
              </div>
            </template>
            <a-card-meta :title="item.title">
              <template #description>
                {{ item.description }}
              </template>
            </a-card-meta>
          </a-card>
        </router-link>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { 
  TeamOutlined,
  CalendarOutlined
} from '@ant-design/icons-vue';

const menuItems = [
  {
    title: 'Сотрудники',
    description: 'Список всех сотрудников, их роли и контактные данные.',
    path: '/employees',
    icon: TeamOutlined
  },
  {
    title: 'График смен',
    description: 'Планирование и просмотр графика работы персонала.',
    path: '/schedule',
    icon: CalendarOutlined
  }
];
</script>
