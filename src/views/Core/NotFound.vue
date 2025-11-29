<template>
  <a-result status="404" title="404" sub-title="Извините, страница, которую вы посетили, не существует.">
    <template #extra>
      <router-link to="/">
        <a-button type="primary">На главную</a-button>
      </router-link>
    </template>
  </a-result>
</template>
