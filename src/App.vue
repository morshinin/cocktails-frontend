<script setup>
import EnvBadge from "./components/Common/EnvBadge.vue";
import { useAuthStore } from "./stores/auth";
import { useRouter, useRoute } from "vue-router";
import { onMounted, ref, watch } from "vue";
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
} from "@ant-design/icons-vue";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// Sidebar state
const collapsed = ref(false);
const selectedKeys = ref([]);
const openKeys = ref([]);

// Auto-select and expand based on current route
watch(
  () => route.path,
  (newPath) => {
    // Determine selected key from path
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
      openKeys.value = ['bar'];
    } else if (pathSegments[0] === 'cocktailMethods') {
      selectedKeys.value = ['cocktailMethods'];
      openKeys.value = ['bar'];
    } else if (pathSegments[0] === 'cocktailGlasses') {
      selectedKeys.value = ['cocktailGlasses'];
      openKeys.value = ['bar'];
    } else if (pathSegments[0] === 'cocktailDecorations') {
      selectedKeys.value = ['cocktailDecorations'];
      openKeys.value = ['bar'];
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
      openKeys.value = ['kitchen'];
    } else if (pathSegments[0] === 'kitchen-methods') {
      selectedKeys.value = ['kitchen-methods'];
      openKeys.value = ['kitchen'];
    } else if (pathSegments[0] === 'allergens') {
      selectedKeys.value = ['allergens'];
      openKeys.value = ['kitchen'];
    } else if (pathSegments[0] === 'upsells') {
      selectedKeys.value = ['upsells'];
      openKeys.value = ['kitchen'];
    } else if (pathSegments[0] === 'employees') {
      selectedKeys.value = ['employees'];
      openKeys.value = ['staff'];
    } else if (pathSegments[0] === 'schedule') {
      selectedKeys.value = ['schedule'];
      openKeys.value = ['staff'];
    } else if (pathSegments[0] === 'users') {
      selectedKeys.value = ['users'];
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
  <a-layout style="min-height: 100vh">
    <!-- Sidebar -->
    <a-layout-sider
      v-if="authStore.isAuthenticated && authStore.selectedVenue"
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      :width="250"
      style="overflow: auto; height: 100vh; position: fixed; left: 0; top: 0; bottom: 0; background: #001529"
    >
      <div class="logo" style="height: 64px; display: flex; align-items: center; justify-content: center; color: white;">
        <img src="./assets/logo.png" alt="Logo" style="height: 32px; width: auto; margin-right: 8px;" />
        <span v-if="!collapsed" style="font-size: 18px; font-weight: bold;">Cocktails</span>
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
          <a-menu-item key="categories">
            <router-link to="/categories">Категории</router-link>
          </a-menu-item>
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
          <a-menu-item key="users">
            <router-link to="/users">Пользователи</router-link>
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

    <!-- Main Layout -->
    <a-layout :style="{ marginLeft: (authStore.isAuthenticated && authStore.selectedVenue) ? (collapsed ? '80px' : '250px') : '0' }">
      <!-- Header -->
      <a-layout-header class="header" style="position: fixed; z-index: 1; width: 100%; right: 0;">
        <div class="header-left">
          <router-link v-if="!authStore.isAuthenticated" to="/" class="logo-link">
            <img src="./assets/logo.png" alt="Logo" class="app-logo" />
            <span>Главная</span>
          </router-link>
        </div>
        
        <div class="auth-actions">
          <div v-if="!authStore.isAuthenticated" class="auth-links">
            <router-link to="/login">Sign in</router-link>
            <router-link to="/register">Sign up</router-link>
          </div>
          
          <div v-else class="user-menu">
            <!-- Venue Selector -->
            <a-select
              v-if="authStore.venues && authStore.venues.length > 0"
              :value="authStore.selectedVenue?._id"
              @change="(venueId) => authStore.selectVenue(authStore.venues.find(v => v._id === venueId))"
              placeholder="Выберите заведение"
              style="width: 200px; margin-right: 16px"
              class="venue-selector"
            >
              <a-select-option
                v-for="venue in authStore.venues"
                :key="venue._id"
                :value="venue._id"
              >
                {{ venue.name }}
              </a-select-option>
            </a-select>
            
            <!-- User Avatar Dropdown -->
            <a-dropdown trigger="click">
              <a-avatar :src="authStore.user?.photoUrl" style="background-color: #87d068; cursor: pointer">
                {{ !authStore.user?.photoUrl ? (authStore.user?.name?.[0]?.toUpperCase() || 'U') : '' }}
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
                  <a-menu-item key="settings">
                    <router-link to="/settings">Settings</router-link>
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

      <!-- Content -->
      <a-layout-content style="margin: 88px 16px 24px; padding: 24px; background: #fff; min-height: 280px">
        <env-badge />
        <router-view :key="authStore.selectedVenue?._id" />
      </a-layout-content>

      <!-- Footer -->
      <a-layout-footer style="text-align: center">
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
  </a-layout>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: #001529;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  color: #fff;
}

.trigger:hover {
  color: #1890ff;
}

.auth-actions {
  margin-left: auto;
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
  color: #fff;
  text-decoration: none;
}

.app-logo {
  height: 32px;
  width: auto;
}

.sidebar-trigger:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #1890ff;
}
</style>

<style>
.venue-selector :deep(.ant-select-selector) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

.venue-selector :deep(.ant-select-arrow) {
  color: rgba(255, 255, 255, 0.65) !important;
}

.venue-selector :deep(.ant-select-selection-placeholder) {
  color: rgba(255, 255, 255, 0.45) !important;
}
</style>
