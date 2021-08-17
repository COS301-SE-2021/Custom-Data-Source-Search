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

    component: () => import('../views/Register.vue')
  },
  {
    path: '/continueView',
    name: 'ContinueView',

    component: () => import('../views/ContinueView.vue')
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
  },
  {
    path: '/backendmanager',
    name: 'BackendManager',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/BackendManager.vue'),
    props: castToNumber
  }
];

function castToNumber(route) {
  return {
    backendID: Number(route.params.backendID),
  };
}

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router
