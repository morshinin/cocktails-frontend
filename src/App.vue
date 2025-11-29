<script setup>
import EnvBadge from "./components/Common/EnvBadge.vue";
import { useAuthStore } from "./stores/auth";
import { useRouter, useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { ShopOutlined } from '@ant-design/icons-vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const openKeys = ref(['organization']);
const collapsed = ref(false);

onMounted(() => {
  if (authStore.isAuthenticated) {
    if (!authStore.user || !authStore.venues || authStore.venues.length === 0) {
      authStore.fetchProfile();
    }
  }
});

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

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
</script>

<template>
  <a-layout style="min-height: 100vh; display: flex; flex-direction: column;">
    <a-layout-header class="header">
      <div class="menu-container">
        <a-menu mode="horizontal" theme="dark">
          <a-menu-item key="home" class="logo-item" v-if="!authStore.isAuthenticated">
            <router-link to="/" class="logo-link">
              <img src="./assets/logo.png" alt="Logo" class="app-logo" />
              Главная
            </router-link>
          </a-menu-item>
          <a-menu-item key="dashboard" class="logo-item" v-else>
            <router-link to="/dashboard" class="logo-link">
              <img src="./assets/logo.png" alt="Logo" class="app-logo" />
              Дашборд
            </router-link>
          </a-menu-item>
          <a-sub-menu key="bar" v-if="authStore.selectedVenue" @titleClick="router.push('/bar')">
            <template #title>
              <span class="cursor-pointer">Бар</span>
            </template>
            <a-menu-item key="cocktails">
              <router-link to="/cocktails">Коктейли</router-link>
            </a-menu-item>
            <a-menu-item key="cocktailComponents">
              <router-link to="/cocktailComponents">Компоненты</router-link>
            </a-menu-item>
            <a-menu-item key="methods">
              <router-link to="/cocktailMethods">Методы</router-link>
            </a-menu-item>
            <a-menu-item key="glasses">
              <router-link to="/cocktailGlasses">Бокалы</router-link>
            </a-menu-item>
            <a-menu-item key="decorations">
              <router-link to="/cocktailDecorations">Украшения</router-link>
            </a-menu-item>
            <a-menu-item key="game">
              <router-link to="/cocktail-game">Коктейль-игра</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="kitchen" v-if="authStore.selectedVenue" @titleClick="router.push('/kitchen')">
            <template #title>
              <span class="cursor-pointer">Кухня</span>
            </template>
            <a-menu-item key="dishes">
              <router-link to="/dishes">Блюда</router-link>
            </a-menu-item>
            <a-menu-item key="ingredients">
              <router-link to="/ingredients">Ингредиенты</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="staff" v-if="authStore.selectedVenue" @titleClick="router.push('/staff')">
            <template #title>
              <span class="cursor-pointer">Персонал</span>
            </template>
            <a-menu-item key="employees">
              <router-link to="/employees">Сотрудники</router-link>
            </a-menu-item>
            <a-menu-item key="schedule">
              <router-link to="/schedule">График смен</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="housekeeping" v-if="authStore.selectedVenue" @titleClick="router.push('/housekeeping')">
            <template #title>
              <span class="cursor-pointer">Хозяйство</span>
            </template>
            <a-menu-item key="schedule-cleaning">
              <router-link to="/housekeeping/schedule">График уборки</router-link>
            </a-menu-item>
            <a-menu-item key="zones">
              <router-link to="/housekeeping/zones">Зоны</router-link>
            </a-menu-item>
            <a-menu-item key="equipment">
              <router-link to="/housekeeping/equipment">Оборудование</router-link>
            </a-menu-item>
            <a-menu-item key="lost-and-found">
              <router-link to="/housekeeping/lost-and-found">Потеряшки</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="service" v-if="authStore.selectedVenue" @titleClick="router.push('/service')">
            <template #title>
              <span class="cursor-pointer">Сервис</span>
            </template>
            <a-menu-item key="reservations">
              <router-link to="/service/reservations">Резерв столов</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="events" v-if="authStore.selectedVenue" @titleClick="router.push('/events')">
            <template #title>
              <span class="cursor-pointer">Мероприятия</span>
            </template>
            <a-menu-item key="djs">
              <router-link to="/events/djs">Диджеи</router-link>
            </a-menu-item>
            <a-menu-item key="schedule">
              <router-link to="/events/schedule">График</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="marketing" v-if="authStore.selectedVenue" @titleClick="router.push('/marketing')">
            <template #title>
              <span class="cursor-pointer">Маркетинг</span>
            </template>
            <a-menu-item key="reviews">
              <router-link to="/marketing/reviews">Отзывы</router-link>
            </a-menu-item>
            <a-menu-item key="guests">
              <router-link to="/marketing/guests">Постоянные гости</router-link>
            </a-menu-item>
            <a-menu-item key="merch">
              <router-link to="/marketing/merch">Мерч</router-link>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </div>
      
      <div class="auth-actions">
        <div v-if="!authStore.isAuthenticated" class="auth-links">
          <router-link to="/login">Sign in</router-link>
          <router-link to="/register">Sign up</router-link>
        </div>
        
        <div v-else class="user-menu">
          <a-dropdown trigger="click">
            <a-avatar style="background-color: #87d068; cursor: pointer">
              {{ authStore.user?.name?.[0]?.toUpperCase() || 'U' }}
            </a-avatar>
            <template #overlay>
              <a-menu>
                <a-menu-item disabled style="color: rgba(0, 0, 0, 0.85); cursor: default;">
                  Вы вошли как {{ roleNames[authStore.user?.role] || authStore.user?.role }}
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="profile">
                  <router-link to="/profile">Profile</router-link>
                </a-menu-item>
                <a-menu-item key="organizations">
                  <router-link to="/organizations">Organizations</router-link>
                </a-menu-item>
                <a-menu-item key="users">
                  <router-link to="/users">Users</router-link>
                </a-menu-item>
                <a-menu-item key="logout" @click="handleLogout">
                  Log out
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </a-layout-header>

    <a-layout style="flex: 1">
      <a-layout-sider
        v-if="authStore.isAuthenticated && route.path !== '/'"
        collapsible
        v-model:collapsed="collapsed"
        theme="light"
      >
        <a-menu
          theme="light"
          mode="inline"
          v-model:openKeys="openKeys"
          :selectedKeys="authStore.selectedVenue ? [authStore.selectedVenue._id] : []"
        >
          <a-sub-menu key="organization">
            <template #title>
              <span>
                <ShopOutlined />
                <span>Организация</span>
              </span>
            </template>
            <a-menu-item
              v-for="venue in authStore.venues"
              :key="venue._id"
              @click="authStore.selectVenue(venue)"
            >
              {{ venue.name }}
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>

      <a-layout-content style="padding: 24px">
        <env-badge />
        <router-view :key="authStore.selectedVenue?._id" />
      </a-layout-content>
    </a-layout>
      
    <a-layout-footer style="text-align: center; background: #f0f2f5; position: relative; z-index: 100;">
      <div class="flex flex-col items-center gap-4">
        <div class="flex gap-8 text-gray-500">
          <span>© 2024 Cocktails App</span>
          <span>v1.2.0</span>
        </div>
        
        <div class="flex gap-8">
          <a href="#" class="text-gray-500 hover:text-blue-500">Помощь / Инструкции</a>
          <a href="#" class="text-gray-500 hover:text-blue-500">Сообщить об ошибке</a>
          <a href="#" class="text-gray-500 hover:text-blue-500">Политика конфиденциальности</a>
        </div>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.menu-container {
  flex: 1;
  min-width: 0;
}

.auth-actions {
  margin-left: 20px;
}

.auth-links {
  display: flex;
  gap: 20px;
}

.auth-links a {
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.auth-links a:hover {
  color: #fff;
}

.user-menu {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 10px;
}

.app-logo {
  height: 32px;
  width: auto;
}
</style>

<style>
.ant-layout-sider-trigger {
  z-index: 50 !important;
}
</style>
