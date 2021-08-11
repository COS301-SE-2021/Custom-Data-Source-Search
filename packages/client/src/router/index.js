import { createRouter, createWebHashHistory } from 'vue-router'
import Register from "../views/Register";

const routes = [
  {
    path: '/',
    name: 'Welcome',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Welcome.vue')
  },
  {
    path: '/search',
    name: 'Search',

    component: () => import(/* webpackChunkName: "about" */ '../views/Search.vue')
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
  },
  {
    path: '/admin',
    name: 'Admin',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Admin.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router
