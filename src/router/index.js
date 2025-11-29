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
  { path: '/', name: 'Home', component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: () => import("../views/Auth/Register.vue") },
  { path: "/select-venue", component: SelectVenue },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/User/Profile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/organizations",
    name: "Organizations",
    component: () => import("../views/Organization/Organizations.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/organizations/:id/venues",
    name: "OrganizationVenues",
    component: () => import("../views/Organization/OrganizationVenues.vue"),
    meta: { requiresAuth: true },
  },
  { path: '/cocktails', name: 'Cocktails', component: Cocktails, meta: { requiresAuth: true } },
  { path: '/cocktails/new', component: AddCocktail, meta: { requiresAuth: true } },
  { path: "/cocktails/:id", component: CocktailDetails, meta: { requiresAuth: true } },
  { path: '/cocktailComponents', name: 'CocktailComponents', component: CocktailComponents, meta: { requiresAuth: true } },
  { path: '/cocktailMethods', name: 'CocktailMethods', component: CocktailMethods, meta: { requiresAuth: true } },
  { path: '/cocktailGlasses', name: 'CocktailGlasses', component: CocktailGlasses, meta: { requiresAuth: true } },
  { path: '/cocktailDecorations', name: 'CocktailDecorations', component: () => import('../views/Bar/CocktailDecorations.vue'), meta: { requiresAuth: true } },
  { path: '/categories', name: 'Categories', component: () => import('../views/Bar/Categories.vue'), meta: { requiresAuth: true } },
  {
    path: "/cocktails/:id/edit",
    name: "EditRecipe",
    component: () => import("../views/Bar/EditRecipe.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/instruction/new",
    component: () => import("../views/Bar/CreateInstruction.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/instruction/:id",
    component: () => import("../views/Bar/RecipeInstruction.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: '/create-instruction',
    name: 'CreateInstruction',
    component: () => import('../views/Bar/CreateInstruction.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/components/:id",
    name: "ComponentView",
    component: () => import("../views/Bar/ComponentView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/bar",
    name: "Bar",
    component: () => import("../views/Bar/Bar.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/users",
    name: "Users",
    component: () => import("../views/Staff/Users.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/kitchen",
    name: "Kitchen",
    component: () => import("../views/Kitchen/Kitchen.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/dishes",
    name: "Dishes",
    component: () => import("../views/Kitchen/Dishes.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/ingredients",
    name: "Ingredients",
    component: () => import("../views/Kitchen/Ingredients.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/ingredients",
    name: "Ingredients",
    component: () => import("../views/Kitchen/Ingredients.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/staff",
    name: "Staff",
    component: () => import("../views/Staff/Staff.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/employees",
    name: "Employees",
    component: () => import("../views/Staff/Employees.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/schedule",
    name: "Schedule",
    component: () => import("../views/Staff/Schedule.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/housekeeping",
    name: "Housekeeping",
    component: () => import("../views/Housekeeping/Housekeeping.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/housekeeping/zones",
    name: "Zones",
    component: () => import("../views/Housekeeping/Zones.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/housekeeping/equipment",
    name: "Equipment",
    component: () => import("../views/Housekeeping/Equipment.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/housekeeping/lost-and-found",
    name: "LostAndFound",
    component: () => import("../views/Housekeeping/LostAndFound.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/housekeeping/schedule",
    name: "CleaningSchedule",
    component: () => import("../views/Housekeeping/CleaningSchedule.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/service",
    name: "Service",
    component: () => import("../views/Service/Service.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/service/reservations",
    name: "Reservations",
    component: () => import("../views/Service/Reservations.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/events",
    name: "Events",
    component: () => import("../views/Events/Events.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/events/djs",
    name: "DJs",
    component: () => import("../views/Events/DJs.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/events/schedule",
    name: "EventSchedule",
    component: () => import("../views/Events/EventSchedule.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/marketing",
    name: "Marketing",
    component: () => import("../views/Marketing/Marketing.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/marketing/reviews",
    name: "Reviews",
    component: () => import("../views/Marketing/Reviews.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/marketing/guests",
    name: "RegularGuests",
    component: () => import("../views/Marketing/RegularGuests.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/marketing/merch",
    name: "Merch",
    component: () => import("../views/Marketing/Merch.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Core/Dashboard.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/Core/NotFound.vue"),
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
