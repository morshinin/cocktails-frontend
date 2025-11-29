<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Управление баром</h1>
    
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
  ExperimentOutlined, 
  AppstoreOutlined, 
  BuildOutlined, 
  CoffeeOutlined, 
  ScissorOutlined, 
  PlayCircleOutlined 
} from '@ant-design/icons-vue';

const menuItems = [
  {
    title: 'Коктейли',
    description: 'Управление рецептами коктейлей, создание новых и редактирование существующих.',
    path: '/cocktails',
    icon: ExperimentOutlined
  },
  {
    title: 'Компоненты',
    description: 'База ингредиентов и компонентов для приготовления напитков.',
    path: '/cocktailComponents',
    icon: AppstoreOutlined
  },
  {
    title: 'Методы',
    description: 'Справочник методов приготовления (шейк, стир, билд и другие).',
    path: '/cocktailMethods',
    icon: BuildOutlined
  },
  {
    title: 'Бокалы',
    description: 'Типы бокалов и посуды подачи.',
    path: '/cocktailGlasses',
    icon: CoffeeOutlined
  },
  {
    title: 'Украшения',
    description: 'Украшения и гарниши для подачи коктейлей.',
    path: '/cocktailDecorations',
    icon: ScissorOutlined
  },
  {
    title: 'Коктейль-игра',
    description: 'Интерактивная игра для обучения и проверки знаний рецептов.',
    path: '/cocktail-game',
    icon: PlayCircleOutlined
  }
];
</script>
