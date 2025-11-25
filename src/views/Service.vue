<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-8 text-white">Сервис</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Table Reservations -->
      <router-link to="/service/reservations" class="block">
        <div class="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors h-full border border-gray-700">
          <div class="text-4xl mb-4">📅</div>
          <h2 class="text-xl font-semibold text-white mb-2">Резерв столов</h2>
          <p class="text-gray-400">Управление бронированием столов</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
// No script needed for now
</script>
