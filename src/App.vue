<script setup>
import EnvBadge from "./components/EnvBadge.vue";
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const authStore = useAuthStore();
const router = useRouter();

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
  <a-layout>
    <a-layout-header class="header">
      <div class="menu-container">
        <a-menu mode="horizontal" theme="dark">
          <a-menu-item key="home">
            <router-link to="/">Главная</router-link>
          </a-menu-item>
          <a-menu-item key="cocktails" v-if="authStore.isAuthenticated">
            <router-link to="/cocktails">Коктейли</router-link>
          </a-menu-item>
          <a-menu-item key="cocktailComponents" v-if="authStore.isAuthenticated">
            <router-link to="/cocktailComponents">Компоненты</router-link>
          </a-menu-item>
          <a-menu-item key="cocktailMethods" v-if="authStore.isAuthenticated">
            <router-link to="/cocktailMethods">Методы</router-link>
          </a-menu-item>
          <a-menu-item key="cocktailGame" v-if="authStore.isAuthenticated">
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

    <a-layout-content style="padding: 24px">
      <env-badge />
      <router-view />
    </a-layout-content>
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
</style>
