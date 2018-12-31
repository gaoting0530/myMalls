import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home.vue'
import Login from '@/components/login.vue'
import Users from '@/components/users/userlists.vue'
import Rights from '@/components/rights/rightslist.vue'
import Roles from '@/components/rights/roleslist.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      children:[
        {
          path:'/users',
          name: 'users',
          component: Users
        },
        {
          path:'/rights',
          name: 'rights',
          component: Rights
        },
        {
          path:'/roles',
          name: 'roles',
          component: Roles
        }
      ]
    }
  ]
})
