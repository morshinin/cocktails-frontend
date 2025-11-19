<script setup>
import { useRouter } from 'vue-router';
import heroBg from '../assets/cocktail_hero_bg.png';

const router = useRouter();
</script>

<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero relative flex items-center justify-center text-center text-white overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img :src="heroBg" alt="Cocktail Background" class="w-full h-full object-cover opacity-60" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#141414]"></div>
      </div>
      
      <div class="relative z-10 max-w-4xl px-6 py-20">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
          Мастерство Коктейлей
        </h1>
        <p class="text-xl md:text-2xl text-gray-200 mb-10 font-light leading-relaxed">
          Ваш персональный гид в мире миксологии. <br class="hidden md:block" />
          Создавайте, экспериментируйте и наслаждайтесь каждым глотком.
        </p>
        <button @click="router.push('/register')" class="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full hover:from-pink-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-600 shadow-lg hover:shadow-pink-500/30 transform hover:-translate-y-1 cursor-pointer">
          <span>Начать сейчас</span>
          <svg class="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
        </button>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features py-20 px-6 bg-[#141414]">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <!-- Feature 1 -->
          <div class="feature-card p-8 rounded-2xl bg-[#1f1f1f] border border-gray-800 hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 group">
            <div class="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">Огромная база</h3>
            <p class="text-gray-400 leading-relaxed">
              Доступ к тысячам рецептов со всего мира. От классики до современных авторских миксов.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="feature-card p-8 rounded-2xl bg-[#1f1f1f] border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 group">
            <div class="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">Управление баром</h3>
            <p class="text-gray-400 leading-relaxed">
              Ведите учет своих ингредиентов. Мы подскажем, что можно приготовить из того, что есть у вас под рукой.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="feature-card p-8 rounded-2xl bg-[#1f1f1f] border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group">
            <div class="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
               <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">Обучение и Игры</h3>
            <p class="text-gray-400 leading-relaxed">
              Изучайте методы приготовления и проверяйте свои знания в увлекательных викторинах.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  /* Compensate for Ant Design Layout Content padding (24px) */
  margin: -24px;
}

.hero {
  min-height: 80vh;
}
</style>
