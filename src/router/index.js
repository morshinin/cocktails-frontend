import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "../stores/auth";
import i18n from '../i18n';
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
  { path: '/', name: 'Home', component: Home, meta: { titleKey: 'pages.home' } },
  { path: "/login", component: Login, meta: { titleKey: 'auth.login' } },
  { path: "/register", component: () => import("../views/Auth/Register.vue"), meta: { titleKey: 'auth.register' } },
  { path: "/verify-email/:token", component: () => import("../views/Auth/VerifyEmail.vue"), meta: { title: 'Email Verification' } },
  { path: "/select-venue", component: SelectVenue, meta: { titleKey: 'auth.selectVenue' } },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/User/Profile.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.profile' },
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/User/Settings.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.settings' },
  },
  {
    path: "/organizations",
    name: "Organizations",
    component: () => import("../views/Organization/Organizations.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.organizations' },
  },
  {
    path: "/organizations/:id/venues",
    name: "OrganizationVenues",
    component: () => import("../views/Organization/OrganizationVenues.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.venues' },
  },
  { path: '/cocktails', name: 'Cocktails', component: Cocktails, meta: { requiresAuth: true, titleKey: 'nav.cocktails' } },
  { path: '/cocktails/new', component: AddCocktail, meta: { requiresAuth: true, titleKey: 'pages.newCocktail' } },
  { path: "/cocktails/:id", component: CocktailDetails, meta: { requiresAuth: true, titleKey: 'pages.cocktail' } },
  { path: '/cocktailComponents', name: 'CocktailComponents', component: CocktailComponents, meta: { requiresAuth: true, titleKey: 'nav.components' } },
  { path: '/cocktailMethods', name: 'CocktailMethods', component: CocktailMethods, meta: { requiresAuth: true, titleKey: 'nav.methods' } },
  { path: '/cocktailGlasses', name: 'CocktailGlasses', component: CocktailGlasses, meta: { requiresAuth: true, titleKey: 'nav.glasses' } },
  { path: '/cocktailDecorations', name: 'CocktailDecorations', component: () => import('../views/Bar/CocktailDecorations.vue'), meta: { requiresAuth: true, titleKey: 'nav.decorations' } },
  { path: '/categories', name: 'Categories', component: () => import('../views/Bar/Categories.vue'), meta: { requiresAuth: true, titleKey: 'nav.categories' } },
  { path: '/bar-counters', name: 'BarCounters', component: () => import('../views/Bar/BarCounters.vue'), meta: { requiresAuth: true, title: 'Барные стойки' } },
  { path: '/bar-counters/:id', name: 'BarCounterDetail', component: () => import('../views/Bar/BarCounterDetail.vue'), meta: { requiresAuth: true, title: 'Барная стойка' } },
  {
    path: "/cocktails/:id/edit",
    name: "EditRecipe",
    component: () => import("../views/Bar/EditRecipe.vue"),
    meta: { requiresAuth: true, titleKey: 'pages.editRecipe' },
  },
  {
    path: "/instruction/new",
    component: () => import("../views/Bar/CreateInstruction.vue"),
    meta: { requiresAuth: true, titleKey: 'pages.createInstruction' }
  },
  {
    path: "/instruction/:id",
    component: () => import("../views/Bar/RecipeInstruction.vue"),
    meta: { requiresAuth: true, titleKey: 'pages.instruction' }
  },
  {
    path: '/create-instruction',
    name: 'CreateInstruction',
    component: () => import('../views/Bar/CreateInstruction.vue'),
    meta: { requiresAuth: true, titleKey: 'pages.createInstruction' }
  },
  {
    path: "/components/:id",
    name: "ComponentView",
    component: () => import("../views/Bar/ComponentView.vue"),
    meta: { requiresAuth: true, titleKey: 'pages.component' },
  },
  {
    path: "/bar",
    name: "Bar",
    component: () => import("../views/Bar/Bar.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.bar' },
  },
  {
    path: "/users",
    name: "Users",
    component: () => import("../views/Staff/Users.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.users' },
  },
  {
    path: "/kitchen",
    name: "Kitchen",
    component: () => import("../views/Kitchen/Kitchen.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.kitchen' },
  },
  {
    path: "/dishes",
    name: "Dishes",
    component: () => import("../views/Kitchen/Dishes.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.dishes' },
  },
  {
    path: "/ingredients",
    name: "Ingredients",
    component: () => import("../views/Kitchen/Ingredients.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.ingredients' },
  },
  {
    path: "/ingredients",
    name: "Ingredients",
    component: () => import("../views/Kitchen/Ingredients.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.ingredients' },
  },
  {
    path: "/staff",
    name: "Staff",
    component: () => import("../views/Staff/Staff.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.staff' },
  },
  {
    path: "/employees",
    name: "Employees",
    component: () => import("../views/Staff/Employees.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.employees' },
  },
  {
    path: "/schedule",
    name: "Schedule",
    component: () => import("../views/Staff/Schedule.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.schedule' },
  },
  {
    path: "/housekeeping",
    name: "Housekeeping",
    component: () => import("../views/Housekeeping/Housekeeping.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.housekeeping' },
  },
  {
    path: "/housekeeping/zones",
    name: "Zones",
    component: () => import("../views/Housekeeping/Zones.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.zones' },
  },
  {
    path: "/housekeeping/equipment",
    name: "Equipment",
    component: () => import("../views/Housekeeping/Equipment.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.equipment' },
  },
  {
    path: "/housekeeping/lost-and-found",
    name: "LostAndFound",
    component: () => import("../views/Housekeeping/LostAndFound.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.lostAndFound' },
  },
  {
    path: "/housekeeping/schedule",
    name: "CleaningSchedule",
    component: () => import("../views/Housekeeping/CleaningSchedule.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.cleaningSchedule' },
  },
  {
    path: "/service",
    name: "Service",
    component: () => import("../views/Service/Service.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.service' },
  },
  {
    path: "/service/reservations",
    name: "Reservations",
    component: () => import("../views/Service/Reservations.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.reservations' },
  },
  {
    path: "/events",
    name: "Events",
    component: () => import("../views/Events/Events.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.events' },
  },
  {
    path: "/events/djs",
    name: "DJs",
    component: () => import("../views/Events/DJs.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.djs' },
  },
  {
    path: "/events/schedule",
    name: "EventSchedule",
    component: () => import("../views/Events/EventSchedule.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.eventSchedule' },
  },
  {
    path: "/marketing",
    name: "Marketing",
    component: () => import("../views/Marketing/Marketing.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.marketing' },
  },
  {
    path: "/marketing/reviews",
    name: "Reviews",
    component: () => import("../views/Marketing/Reviews.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.reviews' },
  },
  {
    path: "/marketing/guests",
    name: "RegularGuests",
    component: () => import("../views/Marketing/RegularGuests.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.regularGuests' },
  },
  {
    path: "/marketing/merch",
    name: "Merch",
    component: () => import("../views/Marketing/Merch.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.merch' },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Core/Dashboard.vue"),
    meta: { requiresAuth: true, titleKey: 'nav.dashboard' },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/Core/NotFound.vue"),
    meta: { titleKey: 'pages.notFound' }
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
  const titleKey = to.meta.titleKey;

  if (titleKey) {
    const title = i18n.global.t(titleKey);
    document.title = venueName ? `${title} - ${venueName}` : title;
  } else {
    document.title = 'Cocktails App';
  }
});

export default router
