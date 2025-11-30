import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "../stores/auth";
import Home from '../views/Core/Home.vue'
import Cocktails from '../views/Bar/Cocktails.vue'
import AddCocktail from '../views/Bar/AddCocktail.vue'
import CocktailComponents from '../views/Bar/CocktailComponents.vue'
import CocktailMethods from '../views/Bar/CocktailMethods.vue'
import CocktailGlasses from '../views/Bar/CocktailGlasses.vue'
import CocktailDetails from "../views/Bar/CocktailDetails.vue"
import Login from "../views/Auth/Login.vue";
import SelectVenue from "../views/Organization/SelectVenue.vue";

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { title: 'Главная' } },
  { path: "/login", component: Login, meta: { title: 'Вход' } },
  { path: "/register", component: () => import("../views/Auth/Register.vue"), meta: { title: 'Регистрация' } },
  { path: "/select-venue", component: SelectVenue, meta: { title: 'Выбор заведения' } },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/User/Profile.vue"),
    meta: { requiresAuth: true, title: 'Профиль' },
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/User/Settings.vue"),
    meta: { requiresAuth: true, title: 'Настройки' },
  },
  {
    path: "/organizations",
    name: "Organizations",
    component: () => import("../views/Organization/Organizations.vue"),
    meta: { requiresAuth: true, title: 'Организации' },
  },
  {
    path: "/organizations/:id/venues",
    name: "OrganizationVenues",
    component: () => import("../views/Organization/OrganizationVenues.vue"),
    meta: { requiresAuth: true, title: 'Заведения' },
  },
  { path: '/cocktails', name: 'Cocktails', component: Cocktails, meta: { requiresAuth: true, title: 'Коктейли' } },
  { path: '/cocktails/new', component: AddCocktail, meta: { requiresAuth: true, title: 'Новый коктейль' } },
  { path: "/cocktails/:id", component: CocktailDetails, meta: { requiresAuth: true, title: 'Коктейль' } },
  { path: '/cocktailComponents', name: 'CocktailComponents', component: CocktailComponents, meta: { requiresAuth: true, title: 'Компоненты' } },
  { path: '/cocktailMethods', name: 'CocktailMethods', component: CocktailMethods, meta: { requiresAuth: true, title: 'Методы' } },
  { path: '/cocktailGlasses', name: 'CocktailGlasses', component: CocktailGlasses, meta: { requiresAuth: true, title: 'Бокалы' } },
  { path: '/cocktailDecorations', name: 'CocktailDecorations', component: () => import('../views/Bar/CocktailDecorations.vue'), meta: { requiresAuth: true, title: 'Украшения' } },
  { path: '/categories', name: 'Categories', component: () => import('../views/Bar/Categories.vue'), meta: { requiresAuth: true, title: 'Категории' } },
  {
    path: "/cocktails/:id/edit",
    name: "EditRecipe",
    component: () => import("../views/Bar/EditRecipe.vue"),
    meta: { requiresAuth: true, title: 'Редактирование рецепта' },
  },
  {
    path: "/instruction/new",
    component: () => import("../views/Bar/CreateInstruction.vue"),
    meta: { requiresAuth: true, title: 'Создание инструкции' }
  },
  {
    path: "/instruction/:id",
    component: () => import("../views/Bar/RecipeInstruction.vue"),
    meta: { requiresAuth: true, title: 'Инструкция' }
  },
  {
    path: '/create-instruction',
    name: 'CreateInstruction',
    component: () => import('../views/Bar/CreateInstruction.vue'),
    meta: { requiresAuth: true, title: 'Создание инструкции' }
  },
  {
    path: "/components/:id",
    name: "ComponentView",
    component: () => import("../views/Bar/ComponentView.vue"),
    meta: { requiresAuth: true, title: 'Компонент' },
  },
  {
    path: "/bar",
    name: "Bar",
    component: () => import("../views/Bar/Bar.vue"),
    meta: { requiresAuth: true, title: 'Бар' },
  },
  {
    path: "/users",
    name: "Users",
    component: () => import("../views/Staff/Users.vue"),
    meta: { requiresAuth: true, title: 'Пользователи' },
  },
  {
    path: "/kitchen",
    name: "Kitchen",
    component: () => import("../views/Kitchen/Kitchen.vue"),
    meta: { requiresAuth: true, title: 'Кухня' },
  },
  {
    path: "/dishes",
    name: "Dishes",
    component: () => import("../views/Kitchen/Dishes.vue"),
    meta: { requiresAuth: true, title: 'Блюда' },
  },
  {
    path: "/ingredients",
    name: "Ingredients",
    component: () => import("../views/Kitchen/Ingredients.vue"),
    meta: { requiresAuth: true, title: 'Ингредиенты' },
  },
  {
    path: "/ingredients",
    name: "Ingredients",
    component: () => import("../views/Kitchen/Ingredients.vue"),
    meta: { requiresAuth: true, title: 'Ингредиенты' },
  },
  {
    path: "/staff",
    name: "Staff",
    component: () => import("../views/Staff/Staff.vue"),
    meta: { requiresAuth: true, title: 'Персонал' },
  },
  {
    path: "/employees",
    name: "Employees",
    component: () => import("../views/Staff/Employees.vue"),
    meta: { requiresAuth: true, title: 'Сотрудники' },
  },
  {
    path: "/schedule",
    name: "Schedule",
    component: () => import("../views/Staff/Schedule.vue"),
    meta: { requiresAuth: true, title: 'График' },
  },
  {
    path: "/housekeeping",
    name: "Housekeeping",
    component: () => import("../views/Housekeeping/Housekeeping.vue"),
    meta: { requiresAuth: true, title: 'Хозяйство' },
  },
  {
    path: "/housekeeping/zones",
    name: "Zones",
    component: () => import("../views/Housekeeping/Zones.vue"),
    meta: { requiresAuth: true, title: 'Зоны' },
  },
  {
    path: "/housekeeping/equipment",
    name: "Equipment",
    component: () => import("../views/Housekeeping/Equipment.vue"),
    meta: { requiresAuth: true, title: 'Оборудование' },
  },
  {
    path: "/housekeeping/lost-and-found",
    name: "LostAndFound",
    component: () => import("../views/Housekeeping/LostAndFound.vue"),
    meta: { requiresAuth: true, title: 'Потеряшки' },
  },
  {
    path: "/housekeeping/schedule",
    name: "CleaningSchedule",
    component: () => import("../views/Housekeeping/CleaningSchedule.vue"),
    meta: { requiresAuth: true, title: 'График уборки' },
  },
  {
    path: "/service",
    name: "Service",
    component: () => import("../views/Service/Service.vue"),
    meta: { requiresAuth: true, title: 'Сервис' },
  },
  {
    path: "/service/reservations",
    name: "Reservations",
    component: () => import("../views/Service/Reservations.vue"),
    meta: { requiresAuth: true, title: 'Резерв столов' },
  },
  {
    path: "/events",
    name: "Events",
    component: () => import("../views/Events/Events.vue"),
    meta: { requiresAuth: true, title: 'Мероприятия' },
  },
  {
    path: "/events/djs",
    name: "DJs",
    component: () => import("../views/Events/DJs.vue"),
    meta: { requiresAuth: true, title: 'Диджеи' },
  },
  {
    path: "/events/schedule",
    name: "EventSchedule",
    component: () => import("../views/Events/EventSchedule.vue"),
    meta: { requiresAuth: true, title: 'График мероприятий' },
  },
  {
    path: "/marketing",
    name: "Marketing",
    component: () => import("../views/Marketing/Marketing.vue"),
    meta: { requiresAuth: true, title: 'Маркетинг' },
  },
  {
    path: "/marketing/reviews",
    name: "Reviews",
    component: () => import("../views/Marketing/Reviews.vue"),
    meta: { requiresAuth: true, title: 'Отзывы' },
  },
  {
    path: "/marketing/guests",
    name: "RegularGuests",
    component: () => import("../views/Marketing/RegularGuests.vue"),
    meta: { requiresAuth: true, title: 'Постоянные гости' },
  },
  {
    path: "/marketing/merch",
    name: "Merch",
    component: () => import("../views/Marketing/Merch.vue"),
    meta: { requiresAuth: true, title: 'Мерч' },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Core/Dashboard.vue"),
    meta: { requiresAuth: true, title: 'Дашборд' },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/Core/NotFound.vue"),
    meta: { title: 'Страница не найдена' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore();

  // Redirect authenticated users from home to dashboard
  if (to.path === '/' && auth.isAuthenticated) {
    return "/dashboard";
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return "/login";
  }

  // user logged in but no venue selected
  if (to.meta.requiresAuth && !auth.selectedVenue && !['Profile', 'Organizations', 'OrganizationVenues', 'Dashboard'].includes(to.name)) {
    return "/select-venue";
  }
});

router.afterEach((to) => {
  const auth = useAuthStore();
  const venueName = auth.selectedVenue?.name;
  const title = to.meta.title;

  if (title) {
    document.title = venueName ? `${title} - ${venueName}` : title;
  } else {
    document.title = 'Cocktails App';
  }
});

export default router
