import { createRouter, createWebHashHistory } from 'vue-router'
import Search from '../views/Search.vue'
import Register from "../views/Register";

const routes = [
  {
    path: '/',
    name: 'Search',
    component: Search
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/datasources',
    name: 'Datasources',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Datasources.vue')
  },
  {
    path: '/addDatasources',
    name: 'AddDatasources',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AddDatasources.vue')
  },
  {
    path: '/settings',
    name: 'SettingsPage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/SettingsPage.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router
