import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Cocktails from '../views/Cocktails.vue'
import AddCocktail from '../views/AddCocktail.vue'
import CocktailComponents from '../views/CocktailComponents.vue'
import CocktailMethods from '../views/CocktailMethods.vue'
import CocktailDetails from "../views/CocktailDetails.vue"

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/cocktails', name: 'Cocktails', component: Cocktails },
  { path: '/cocktails/new', component: AddCocktail },
  { path: "/cocktails/:id", component: CocktailDetails },
  { path: '/cocktailComponents', name: 'CocktailComponents', component: CocktailComponents },
  { path: '/cocktailMethods', name: 'CocktailMethods', component: CocktailMethods },
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
    path: '/cocktail-game',
    name: 'CocktailGame',
    component: () => import('../views/CocktailGame.vue')
  },
  {
    path: "/components/:id",
    name: "ComponentView",
    component: () => import("../views/ComponentView.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
