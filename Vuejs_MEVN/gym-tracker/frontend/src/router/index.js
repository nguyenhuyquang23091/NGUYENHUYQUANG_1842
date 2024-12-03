import { createRouter, createWebHistory } from 'vue-router';
import HomeView from "../views/Homepage.vue"
import NotFound from '../views/NotFound.vue'; 
import Register from '../views/Register.vue';
import { useAuthStore } from '../stores/authStores';

const routes = [
  {
    path: '/',
    name: 'Register', 
    component: Register,
  },
  {
    path : '/homeview',
    name: 'homeview',
    component: HomeView,
    beforeEnter: (to, from, next) =>{
      const authStore  = useAuthStore();
      if(!authStore.isAuthenticated){
        next('/');

      }else{
        next();}
    }
  },
  {
    path: '/:pathMatch(.*)*', 
    name: 'NotFound',
    component: NotFound,
  },
  
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
