import Vue from 'vue'
import Router from 'vue-router'
import {Message} from 'element-ui'
import Home from '@/components/home.vue'
import Login from '@/components/login.vue'
import Users from '@/components/users/userlists.vue'
import Rights from '@/components/rights/rightslist.vue'
import Roles from '@/components/rights/roleslist.vue'
import Goods from '@/components/goods/goods.vue'
import Params from '@/components/goods/params.vue'
import Categories from '@/components/goods/categories.vue'
import AddGoods from '@/components/goods/addgoods.vue'
import Orders from '@/components/orders/orderlists.vue'
import Reports from '@/components/reports/reports.vue'


Vue.use(Router)

const router = new Router({
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
        },
        {
          path:'/goods',
          name: 'goods',
          component: Goods
        },
        {
          path:'/params',
          name: 'params',
          component: Params
        },
        {
          path:'/categories',
          name: 'categories',
          component: Categories
        },
        {
          path:'/addgoods',
          name: 'addgoods',
          component: AddGoods
        },
        {
          path:'/orders',
          name: 'orders',
          component: Orders
        },
        {
          path:'/reports',
          name: 'reports',
          component: Reports
        }
      ]
    }
  ]
})
// 设置路由守卫
router.beforeEach((to, from, next) => {
  if(to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if(!token) {
      //如果未登录，提示用户登录
      Message.warning('请先登录！')
      router.push({name: 'login'})
      return
    }
    next()
  }
})
export default router
