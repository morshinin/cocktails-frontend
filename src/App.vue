<script setup>
import EnvBadge from "./components/EnvBadge.vue";
import { useAuthStore } from "./stores/auth";
import { useRouter, useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { ShopOutlined } from '@ant-design/icons-vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const openKeys = ref(['organization']);
const collapsed = ref(true);

onMounted(() => {
  if (authStore.isAuthenticated && !authStore.user) {
    authStore.fetchProfile();
  }
});

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <a-layout style="min-height: 100vh">
    <a-layout-header class="header">
      <div class="menu-container">
        <a-menu mode="horizontal" theme="dark">
          <a-menu-item key="home" class="logo-item">
            <router-link to="/" class="logo-link">
              <img src="./assets/logo.png" alt="Logo" class="app-logo" />
              Главная
            </router-link>
          </a-menu-item>
          <a-menu-item key="cocktails" v-if="authStore.selectedVenue">
            <router-link to="/cocktails">Коктейли</router-link>
          </a-menu-item>
          <a-menu-item key="cocktailComponents" v-if="authStore.selectedVenue">
            <router-link to="/cocktailComponents">Компоненты</router-link>
          </a-menu-item>
          <a-menu-item key="methods" v-if="authStore.selectedVenue">
            <router-link to="/cocktailMethods">Методы</router-link>
          </a-menu-item>
          <a-menu-item key="glasses" v-if="authStore.selectedVenue">
            <router-link to="/cocktailGlasses">Бокалы</router-link>
          </a-menu-item>
          <a-menu-item key="decorations" v-if="authStore.selectedVenue">
            <router-link to="/cocktailDecorations">Украшения</router-link>
          </a-menu-item>
          <a-menu-item key="game" v-if="authStore.selectedVenue">
            <router-link to="/cocktail-game">Коктейль-игра</router-link>
          </a-menu-item>
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
                <a-menu-item key="profile">
                  <router-link to="/profile">Profile</router-link>
                </a-menu-item>
                <a-menu-item key="organizations">
                  <router-link to="/organizations">Organizations</router-link>
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

    <a-layout>
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
