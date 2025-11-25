<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-8 text-white">Хозяйство</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Cleaning Schedule -->
      <router-link to="/housekeeping/schedule" class="block">
        <div class="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors h-full border border-gray-700">
          <div class="text-4xl mb-4">📅</div>
          <h2 class="text-xl font-semibold text-white mb-2">График уборки</h2>
          <p class="text-gray-400">Ежедневные задачи и контроль чистоты</p>
        </div>
      </router-link>

      <!-- Zones -->
      <router-link to="/housekeeping/zones" class="block">
        <div class="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors h-full border border-gray-700">
          <div class="text-4xl mb-4">🏗️</div>
          <h2 class="text-xl font-semibold text-white mb-2">Зоны</h2>
          <p class="text-gray-400">Управление зонами заведения</p>
        </div>
      </router-link>

      <!-- Equipment -->
      <router-link to="/housekeeping/equipment" class="block">
        <div class="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors h-full border border-gray-700">
          <div class="text-4xl mb-4">🔧</div>
          <h2 class="text-xl font-semibold text-white mb-2">Оборудование</h2>
          <p class="text-gray-400">Учет и статус оборудования</p>
        </div>
      </router-link>

      <!-- Lost & Found -->
      <router-link to="/housekeeping/lost-and-found" class="block">
        <div class="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors h-full border border-gray-700">
          <div class="text-4xl mb-4">🧤</div>
          <h2 class="text-xl font-semibold text-white mb-2">Потеряшки</h2>
          <p class="text-gray-400">Забытые вещи посетителей</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
// No script needed for now
</script>
