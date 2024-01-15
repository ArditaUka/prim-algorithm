import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EasyView from '../views/EasyView.vue'
import MediumView from '../views/MediumView.vue'
import HardView from '../views/HardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/easy',
      name: 'easy',
      component: EasyView
    },
    {
      path: '/medium',
      name: 'medium',
      component: MediumView
    },
    {
      path: '/hard',
      name: 'hard',
      component: HardView
    }
  ]
})

export default router
