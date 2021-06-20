import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/test',
    name: 'TEST',
    component: () => import('../views/Test')
  },
  {
    path: '/todoApp',
    name: 'Todo App',
    component: () => import('../views/TodoApp')
  },
  {
    path: '/design',
    name: 'Design',
    component: () => import('../views/Design')
  },
  {
    path: '/testLandingPage',
    name: 'TestLandingPage',
    component: () => import('../views/TestLandingPage')
  },
  {
    path: '/ViewDataSource',
    name: 'ViewDataSource',
    component: () => import('../views/ViewDataSource')
  },
  {
    path: '/AddDataSource',
    name: 'AddDataSource',
    component: () => import('../views/AddDataSource')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
