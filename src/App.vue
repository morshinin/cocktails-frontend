<script setup>
import EnvBadge from "./components/Common/EnvBadge.vue";
import AppFooter from "./components/Common/AppFooter.vue";
import AppSidebar from "./components/Common/AppSidebar.vue";
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";

const authStore = useAuthStore();
const router = useRouter();
const sidebarRef = ref(null);



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
    <AppSidebar ref="sidebarRef" />

    <!-- Main Layout -->
    <a-layout :style="{ marginLeft: (authStore.isAuthenticated && authStore.selectedVenue) ? (sidebarRef?.collapsed ? '80px' : '250px') : '0' }">
      <!-- Header -->
      <a-layout-header class="header" style="position: fixed; z-index: 1; width: 100%; right: 0;">
        <div class="header-left">
          <router-link to="/" class="logo-link">
            <img src="./assets/logo.png" alt="Logo" class="app-logo" />
            <span style="font-size: 18px; font-weight: bold;">UselessBarApp</span>
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
              popupClassName="venue-selector-dropdown"
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
      <a-layout-content style="margin-top: 64px; background: #fff; min-height: 280px">
        <env-badge />
        <router-view :key="authStore.selectedVenue?._id" />
      </a-layout-content>

      <!-- Footer -->
      <AppFooter />
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


</style>

<style>
/* Venue selector - main input */
.header .venue-selector .ant-select-selector {
  background-color: #001529 !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: white !important;
}

.header .venue-selector .ant-select-selector:hover {
  border-color: rgba(255, 255, 255, 0.5) !important;
  background-color: #001529 !important;
}

.header .venue-selector .ant-select-arrow {
  color: rgba(255, 255, 255, 0.65) !important;
}

.header .venue-selector .ant-select-selection-placeholder {
  color: rgba(255, 255, 255, 0.45) !important;
}

.header .venue-selector .ant-select-selection-item {
  color: white !important;
}

/* Also target with class directly */
.venue-selector.ant-select .ant-select-selector {
  background-color: #001529 !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
}

/* Venue selector dropdown - global styles */
.venue-selector-dropdown {
  background-color: #001529 !important;
}

.venue-selector-dropdown .ant-select-item {
  color: rgba(255, 255, 255, 0.85) !important;
}

.venue-selector-dropdown .ant-select-item-option-selected {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
}

.venue-selector-dropdown .ant-select-item-option-active {
  background-color: rgba(255, 255, 255, 0.15) !important;
}
</style>
