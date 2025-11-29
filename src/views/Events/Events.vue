<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Мероприятия</h1>
    
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
  AudioOutlined,
  CalendarOutlined
} from '@ant-design/icons-vue';

const menuItems = [
  {
    title: 'Диджеи',
    description: 'База артистов и диджеев',
    path: '/events/djs',
    icon: AudioOutlined
  },
  {
    title: 'График мероприятий',
    description: 'Календарь событий и выступлений',
    path: '/events/schedule',
    icon: CalendarOutlined
  }
];
</script>
