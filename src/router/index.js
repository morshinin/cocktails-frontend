import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "../stores/auth";
import Home from '../views/Home.vue'
import Cocktails from '../views/Cocktails.vue'
import AddCocktail from '../views/AddCocktail.vue'
import CocktailComponents from '../views/CocktailComponents.vue'
import CocktailMethods from '../views/CocktailMethods.vue'
import CocktailGlasses from '../views/CocktailGlasses.vue'
import CocktailDetails from "../views/CocktailDetails.vue"
import Login from "../views/Login.vue";
import SelectVenue from "../views/SelectVenue.vue";

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: () => import("../views/Register.vue") },
  { path: "/select-venue", component: SelectVenue },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/organizations",
    name: "Organizations",
    component: () => import("../views/Organizations.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/organizations/:id/venues",
    name: "OrganizationVenues",
    component: () => import("../views/OrganizationVenues.vue"),
    meta: { requiresAuth: true },
  },
  { path: '/cocktails', name: 'Cocktails', component: Cocktails },
  { path: '/cocktails/new', component: AddCocktail },
  { path: "/cocktails/:id", component: CocktailDetails },
  { path: '/cocktailComponents', name: 'CocktailComponents', component: CocktailComponents },
  { path: '/cocktailMethods', name: 'CocktailMethods', component: CocktailMethods },
  { path: '/cocktailGlasses', name: 'CocktailGlasses', component: CocktailGlasses },
  { path: '/cocktailDecorations', name: 'CocktailDecorations', component: () => import('../views/CocktailDecorations.vue') },
  { path: '/categories', name: 'Categories', component: () => import('../views/Categories.vue') },
  {
    path: "/cocktails/:id/edit",
    name: "EditRecipe",
    component: () => import("../views/EditRecipe.vue"),
  },
  {
    path: "/instruction/new",
    component: () => import("../views/CreateInstruction.vue")
  },
  {
    path: "/instruction/:id",
    component: () => import("../views/RecipeInstruction.vue")
  },
  {
    path: '/create-instruction',
    name: 'CreateInstruction',
    component: () => import('../views/CreateInstruction.vue')
  },
  {
    path: "/components/:id",
    name: "ComponentView",
    component: () => import("../views/ComponentView.vue"),
  },
  {
    path: "/bar",
    name: "Bar",
    component: () => import("../views/Bar.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/users",
    name: "Users",
    component: () => import("../views/Users.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/kitchen",
    name: "Kitchen",
    component: () => import("../views/Kitchen.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/dishes",
    name: "Dishes",
    component: () => import("../views/Dishes.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/ingredients",
    name: "Ingredients",
    component: () => import("../views/Ingredients.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/ingredients",
    name: "Ingredients",
    component: () => import("../views/Ingredients.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/staff",
    name: "Staff",
    component: () => import("../views/Staff.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/employees",
    name: "Employees",
    component: () => import("../views/Employees.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/schedule",
    name: "Schedule",
    component: () => import("../views/Schedule.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/housekeeping",
    name: "Housekeeping",
    component: () => import("../views/Housekeeping.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/housekeeping/zones",
    name: "Zones",
    component: () => import("../views/Zones.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/housekeeping/equipment",
    name: "Equipment",
    component: () => import("../views/Equipment.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/housekeeping/lost-and-found",
    name: "LostAndFound",
    component: () => import("../views/LostAndFound.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/housekeeping/schedule",
    name: "CleaningSchedule",
    component: () => import("../views/CleaningSchedule.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/service",
    name: "Service",
    component: () => import("../views/Service.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/service/reservations",
    name: "Reservations",
    component: () => import("../views/Reservations.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/events",
    name: "Events",
    component: () => import("../views/Events.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/events/djs",
    name: "DJs",
    component: () => import("../views/DJs.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/events/schedule",
    name: "EventSchedule",
    component: () => import("../views/EventSchedule.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: { requiresAuth: true },
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

export default router
