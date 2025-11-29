<script setup>
import { useRouter } from 'vue-router';
import heroBg from '../../assets/cocktail_hero_bg.png';
import { 
  BookOutlined, 
  BarChartOutlined, 
  ApiOutlined, 
  ScheduleOutlined, 
  ShopOutlined, 
  TeamOutlined,
  RocketOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue';

const router = useRouter();

const features = [
  {
    icon: BookOutlined,
    title: 'Технические карты',
    description: 'Понятные и подробные технические карты для бара и кухни. Стандартизируйте качество ваших напитков и блюд.',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: BarChartOutlined,
    title: 'Глубокая аналитика',
    description: 'Полная статистика по ингредиентам, коктейлям и блюдам. Принимайте решения на основе данных.',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    icon: ApiOutlined,
    title: 'API для сайта',
    description: 'Легкая интеграция вашего меню с сайтом. Обновляйте цены и наличие в одном месте.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: ScheduleOutlined,
    title: 'График сотрудников',
    description: 'Удобное планирование смен и учет рабочего времени вашего персонала.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: ShopOutlined,
    title: 'Склад и Закупки',
    description: 'Умное наполнение бара, складской учет и управление поставщиками. Забудьте о стоп-листах.',
    color: 'from-orange-500 to-amber-500'
  },
  {
    icon: TeamOutlined,
    title: 'HR и Онбординг',
    description: 'Инструменты для найма и быстрого обучения новых сотрудников. База знаний всегда под рукой.',
    color: 'from-red-500 to-pink-500'
  }
];

const roadmap = [
  { title: 'Q1 2025', items: ['Запуск мобильного приложения', 'Интеграция с POS системами'] },
  { title: 'Q2 2025', items: ['AI-сомелье для гостей', 'Продвинутая система лояльности'] },
  { title: 'Q3 2025', items: ['Маркетплейс поставщиков', 'Автоматический заказ продуктов'] },
  { title: 'Q4 2025', items: ['Франшизный пакет', 'Глобальная аналитика рынка'] }
];

const pricing = [
  {
    title: 'Free',
    price: '$0',
    period: '/ навсегда',
    description: 'Идеально для старта',
    features: ['1 Заведение', 'Базовые тех. карты', 'До 5 сотрудников', 'Базовая аналитика'],
    buttonText: 'Попробовать бесплатно',
    highlight: false
  },
  {
    title: 'Pro',
    price: '$10',
    period: '/ месяц',
    description: 'Для растущего бизнеса',
    features: ['Неограниченно заведений (1 орг.)', 'API доступ', 'Складской учет', 'Приоритетная поддержка'],
    buttonText: 'Начать с Pro',
    highlight: true
  },
  {
    title: 'Enterprise',
    price: '$50',
    period: '/ месяц',
    description: 'Для крупных сетей',
    features: ['Неограниченно организаций', 'Персональный менеджер', 'Кастомные доработки', 'SLA гарантии'],
    buttonText: 'Связаться с нами',
    highlight: false
  }
];
</script>

<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero relative flex items-center justify-center text-center text-white overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img :src="heroBg" alt="Cocktail Background" class="w-full h-full object-cover opacity-60" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#141414]"></div>
      </div>
      
      <div class="relative z-10 max-w-5xl px-6 py-20">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">
          Управляйте баром как профи
        </h1>
        <p class="text-xl md:text-2xl text-gray-300 mb-10 font-light leading-relaxed max-w-3xl mx-auto">
          Комплексная платформа для владельцев заведений. <br class="hidden md:block" />
          От техкарт и склада до управления персоналом и аналитики.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="router.push('/register')" class="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black transition-all duration-200 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full hover:from-amber-300 hover:to-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-lg hover:shadow-amber-500/30 transform hover:-translate-y-1 cursor-pointer">
            <span>Попробовать бесплатно</span>
            <RocketOutlined class="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 px-6 bg-[#141414]">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Всё для успеха вашего заведения</h2>
          <p class="text-gray-400 text-lg">Инструменты, которые экономят время и деньги</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(feature, index) in features" :key="index" 
               class="feature-card p-8 rounded-2xl bg-[#1f1f1f] border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:shadow-xl group">
            <div :class="`w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`">
              <component :is="feature.icon" class="text-2xl" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">{{ feature.title }}</h3>
            <p class="text-gray-400 leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Roadmap Section -->
    <section class="py-24 px-6 bg-[#0a0a0a] relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Планы развития</h2>
          <p class="text-gray-400 text-lg">Мы постоянно растем вместе с вами</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(quarter, index) in roadmap" :key="index" class="relative">
            <div class="h-full p-6 rounded-xl bg-[#141414] border border-gray-800 hover:border-amber-500/30 transition-colors">
              <div class="text-amber-500 font-bold text-xl mb-4">{{ quarter.title }}</div>
              <ul class="space-y-3">
                <li v-for="(item, i) in quarter.items" :key="i" class="flex items-start text-gray-300 text-sm">
                  <div class="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5 mr-2 flex-shrink-0"></div>
                  {{ item }}
                </li>
              </ul>
            </div>
            <!-- Connector line for desktop -->
            <div v-if="index < roadmap.length - 1" class="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gray-800 z-10"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="py-24 px-6 bg-[#141414]">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Простые тарифы</h2>
          <p class="text-gray-400 text-lg">Выберите план, который подходит именно вам</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div v-for="(plan, index) in pricing" :key="index" 
               :class="`relative p-8 rounded-2xl border ${plan.highlight ? 'bg-[#1a1a1a] border-amber-500 shadow-2xl shadow-amber-900/20 transform md:-translate-y-4' : 'bg-[#1f1f1f] border-gray-800'} flex flex-col transition-all duration-300`">
            
            <div v-if="plan.highlight" class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Популярный
            </div>

            <h3 class="text-xl font-bold text-white mb-2">{{ plan.title }}</h3>
            <div class="flex items-baseline mb-4">
              <span class="text-4xl font-bold text-white">{{ plan.price }}</span>
              <span class="text-gray-500 ml-2">{{ plan.period }}</span>
            </div>
            <p class="text-gray-400 mb-6 text-sm">{{ plan.description }}</p>
            
            <div class="flex-grow space-y-4 mb-8">
              <div v-for="(feature, i) in plan.features" :key="i" class="flex items-center text-gray-300">
                <CheckCircleOutlined class="text-amber-500 mr-3" />
                <span class="text-sm">{{ feature }}</span>
              </div>
            </div>

            <button :class="`w-full py-3 rounded-xl font-bold transition-all duration-200 ${plan.highlight ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-gray-800 text-white hover:bg-gray-700'}`">
              {{ plan.buttonText }}
            </button>
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
  min-height: 85vh;
}
</style>
