import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/import',
    name: 'Import',
    component: () => import(/* webpackChunkName: "about" */ '../views/Import.vue')
  },
  {
    path: '/export',
    name: 'Export',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "settings" */ '../views/Export.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
