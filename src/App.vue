<script setup>
import EnvBadge from "./components/EnvBadge.vue";
import { useAuthStore } from "./stores/auth";

const authStore = useAuthStore();
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
      <div class="auth-links">
        <router-link to="/login">Sign in</router-link>
        <router-link to="/register">Sign up</router-link>
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
  padding: 0 24px; /* Ensure padding matches typical Ant Design header */
}

.menu-container {
  flex: 1;
  min-width: 0; /* Prevent overflow */
}

.auth-links {
  display: flex;
  gap: 20px;
  margin-left: 20px;
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
</style>
