<script setup>
</script>

<template>
  <a-layout>
    <a-layout-header>
      <a-menu mode="horizontal" theme="dark">
        <a-menu-item key="cocktails">
          <router-link to="/cocktails">Коктейли</router-link>
        </a-menu-item>
        <a-menu-item key="cocktailComponents">
          <router-link to="/cocktailComponents">Компоненты</router-link>
        </a-menu-item>
        <a-menu-item key="cocktailMethods">
          <router-link to="/cocktailMethods">Методы</router-link>
        </a-menu-item>
        <a-menu-item key="cocktailGame">
          <router-link to="/cocktail-game">Коктейль-игра</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-header>

    <a-layout-content style="padding: 24px">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<style scoped></style>
