<script setup>
const mode = import.meta.env.VITE_ENV_NAME;
const isProd = mode === "PRODUCTION";
</script>

<template>
  <div
    v-if="!isProd"
    class="fixed bottom-4 right-4 px-3 py-1 text-sm rounded bg-black/70 text-white z-50"
  >
    {{ mode }} MODE
  </div>
</template>
