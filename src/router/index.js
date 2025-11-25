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
