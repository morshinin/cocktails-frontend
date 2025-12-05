<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import {
  HomeOutlined,
  CoffeeOutlined,
  FireOutlined,
  TeamOutlined,
  CalendarOutlined,
  ShopOutlined,
  ToolOutlined,
  CustomerServiceOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue';

const authStore = useAuthStore();
const route = useRoute();

// Initialize collapsed state from localStorage setting
const sidebarDefaultState = localStorage.getItem('sidebarDefaultState') || 'expanded';
const collapsed = ref(sidebarDefaultState === 'collapsed');
const selectedKeys = ref([]);
const openKeys = ref([]);

// Auto-select and expand based on current route
watch(
  () => route.path,
  (newPath) => {
    const pathSegments = newPath.split('/').filter(Boolean);
    
    if (pathSegments.length === 0) {
      selectedKeys.value = ['dashboard'];
    } else if (pathSegments[0] === 'dashboard') {
      selectedKeys.value = ['dashboard'];
    } else if (pathSegments[0] === 'cocktails') {
      selectedKeys.value = ['cocktails'];
      openKeys.value = ['bar'];
    } else if (pathSegments[0] === 'cocktailComponents') {
      selectedKeys.value = ['cocktailComponents'];
      openKeys.value = ['bar', 'bar-references'];
    } else if (pathSegments[0] === 'cocktailMethods') {
      selectedKeys.value = ['cocktailMethods'];
      openKeys.value = ['bar', 'bar-references'];
    } else if (pathSegments[0] === 'cocktailGlasses') {
      selectedKeys.value = ['cocktailGlasses'];
      openKeys.value = ['bar', 'bar-references'];
    } else if (pathSegments[0] === 'cocktailDecorations') {
      selectedKeys.value = ['cocktailDecorations'];
      openKeys.value = ['bar', 'bar-references'];
    } else if (pathSegments[0] === 'categories') {
      selectedKeys.value = ['categories'];
      openKeys.value = ['bar'];
    } else if (pathSegments[0] === 'bar-counters') {
      selectedKeys.value = ['bar-counters'];
      openKeys.value = ['bar'];
    } else if (pathSegments[0] === 'cocktail-game') {
      selectedKeys.value = ['cocktail-game'];
      openKeys.value = ['bar'];
    } else if (pathSegments[0] === 'dishes') {
      selectedKeys.value = ['dishes'];
      openKeys.value = ['kitchen'];
    } else if (pathSegments[0] === 'ingredients') {
      selectedKeys.value = ['ingredients'];
      openKeys.value = ['kitchen', 'kitchen-references'];
    } else if (pathSegments[0] === 'kitchen-methods') {
      selectedKeys.value = ['kitchen-methods'];
      openKeys.value = ['kitchen', 'kitchen-references'];
    } else if (pathSegments[0] === 'allergens') {
      selectedKeys.value = ['allergens'];
      openKeys.value = ['kitchen', 'kitchen-references'];
    } else if (pathSegments[0] === 'upsells') {
      selectedKeys.value = ['upsells'];
      openKeys.value = ['kitchen', 'kitchen-references'];
    } else if (pathSegments[0] === 'employees') {
      selectedKeys.value = ['employees'];
      openKeys.value = ['staff'];
    } else if (pathSegments[0] === 'schedule') {
      selectedKeys.value = ['schedule'];
      openKeys.value = ['staff'];
    } else if (pathSegments[0] === 'events') {
      if (pathSegments[1] === 'schedule') {
        selectedKeys.value = ['events-schedule'];
      } else if (pathSegments[1] === 'djs') {
        selectedKeys.value = ['djs'];
      }
      openKeys.value = ['events'];
    } else if (pathSegments[0] === 'marketing') {
      if (pathSegments[1] === 'guests') {
        selectedKeys.value = ['regular-guests'];
      } else if (pathSegments[1] === 'merch') {
        selectedKeys.value = ['merch'];
      } else if (pathSegments[1] === 'reviews') {
        selectedKeys.value = ['reviews'];
      }
      openKeys.value = ['marketing'];
    } else if (pathSegments[0] === 'housekeeping') {
      if (pathSegments[1] === 'zones') {
        selectedKeys.value = ['zones'];
      } else if (pathSegments[1] === 'equipment') {
        selectedKeys.value = ['equipment'];
      } else if (pathSegments[1] === 'schedule') {
        selectedKeys.value = ['cleaning-schedule'];
      } else if (pathSegments[1] === 'lost-and-found') {
        selectedKeys.value = ['lost-and-found'];
      }
      openKeys.value = ['housekeeping'];
    } else if (pathSegments[0] === 'service') {
      if (pathSegments[1] === 'reservations') {
        selectedKeys.value = ['reservations'];
      }
      openKeys.value = ['service'];
    }
  },
  { immediate: true }
);

defineExpose({ collapsed });
</script>

<template>
  <a-layout-sider
    v-if="authStore.isAuthenticated && authStore.selectedVenue"
    v-model:collapsed="collapsed"
    :trigger="null"
    collapsible
    :width="250"
    style="overflow: auto; height: 100vh; position: fixed; left: 0; top: 0; bottom: 0; background: #001529"
  >
    <div class="logo" style="height: 64px; display: flex; align-items: center; justify-content: center; color: white;">
      <img src="../../assets/logo.png" alt="Logo" style="height: 32px; width: auto; margin-right: 8px;" />
      <span v-if="!collapsed" style="font-size: 18px; font-weight: bold;">UselessBarApp</span>
    </div>
    
    <a-menu
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      mode="inline"
      theme="dark"
      :inline-collapsed="collapsed"
    >
      <a-menu-item key="dashboard">
        <router-link to="/dashboard">
          <HomeOutlined />
          <span>Главная</span>
        </router-link>
      </a-menu-item>

      <a-sub-menu key="bar">
        <template #title>
          <span>
            <CoffeeOutlined />
            <span>Бар</span>
          </span>
        </template>
        <a-menu-item key="cocktails">
          <router-link to="/cocktails">Коктейли</router-link>
        </a-menu-item>
        <a-sub-menu key="bar-references">
          <template #title>
            <span>Справочники</span>
          </template>
          <a-menu-item key="cocktailComponents">
            <router-link to="/cocktailComponents">Компоненты</router-link>
          </a-menu-item>
          <a-menu-item key="cocktailMethods">
            <router-link to="/cocktailMethods">Методы</router-link>
          </a-menu-item>
          <a-menu-item key="cocktailGlasses">
            <router-link to="/cocktailGlasses">Бокалы</router-link>
          </a-menu-item>
          <a-menu-item key="cocktailDecorations">
            <router-link to="/cocktailDecorations">Украшения</router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="bar-counters">
          <router-link to="/bar-counters">Барные стойки</router-link>
        </a-menu-item>
        <a-menu-item key="cocktail-game">
          <router-link to="/cocktail-game">Коктейль-игра</router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="kitchen">
        <template #title>
          <span>
            <FireOutlined />
            <span>Кухня</span>
          </span>
        </template>
        <a-menu-item key="dishes">
          <router-link to="/dishes">Блюда</router-link>
        </a-menu-item>
        <a-sub-menu key="kitchen-references">
          <template #title>
            <span>Справочники</span>
          </template>
          <a-menu-item key="ingredients">
            <router-link to="/ingredients">Ингредиенты</router-link>
          </a-menu-item>
          <a-menu-item key="kitchen-methods">
            <router-link to="/kitchen-methods">Методы</router-link>
          </a-menu-item>
          <a-menu-item key="allergens">
            <router-link to="/allergens">Аллергены</router-link>
          </a-menu-item>
          <a-menu-item key="upsells">
            <router-link to="/upsells">Доп. продажа</router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-sub-menu>

      <a-sub-menu key="staff">
        <template #title>
          <span>
            <TeamOutlined />
            <span>Персонал</span>
          </span>
        </template>
        <a-menu-item key="employees">
          <router-link to="/employees">Сотрудники</router-link>
        </a-menu-item>
        <a-menu-item key="schedule">
          <router-link to="/schedule">График смен</router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="events">
        <template #title>
          <span>
            <CalendarOutlined />
            <span>Мероприятия</span>
          </span>
        </template>
        <a-menu-item key="events-schedule">
          <router-link to="/events/schedule">График</router-link>
        </a-menu-item>
        <a-menu-item key="djs">
          <router-link to="/events/djs">DJ</router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="marketing">
        <template #title>
          <span>
            <ShopOutlined />
            <span>Маркетинг</span>
          </span>
        </template>
        <a-menu-item key="regular-guests">
          <router-link to="/marketing/guests">Постоянные гости</router-link>
        </a-menu-item>
        <a-menu-item key="merch">
          <router-link to="/marketing/merch">Мерч</router-link>
        </a-menu-item>
        <a-menu-item key="reviews">
          <router-link to="/marketing/reviews">Отзывы</router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="housekeeping">
        <template #title>
          <span>
            <ToolOutlined />
            <span>Хозяйство</span>
          </span>
        </template>
        <a-menu-item key="zones">
          <router-link to="/housekeeping/zones">Зоны</router-link>
        </a-menu-item>
        <a-menu-item key="equipment">
          <router-link to="/housekeeping/equipment">Оборудование</router-link>
        </a-menu-item>
        <a-menu-item key="cleaning-schedule">
          <router-link to="/housekeeping/schedule">График уборки</router-link>
        </a-menu-item>
        <a-menu-item key="lost-and-found">
          <router-link to="/housekeeping/lost-and-found">Потеряшки</router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="service">
        <template #title>
          <span>
            <CustomerServiceOutlined />
            <span>Сервис</span>
          </span>
        </template>
        <a-menu-item key="reservations">
          <router-link to="/service/reservations">Резерв столов</router-link>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
    
    <!-- Collapse Trigger -->
    <div 
      class="sidebar-trigger" 
      @click="() => (collapsed = !collapsed)"
      :style="{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#fff',
        fontSize: '18px',
        transition: 'all 0.3s'
      }"
    >
      <menu-fold-outlined v-if="!collapsed" />
      <menu-unfold-outlined v-else />
    </div>
  </a-layout-sider>
</template>

<style scoped>
.sidebar-trigger:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #1890ff;
}
</style>
