import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
import dashboard from '../views/layout/dashboard'
import edit from '../views/edit/index'
Vue.use(Router)

/* layout */
/** note: submenu only apppear when children.length>=1
*
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404') },
  { path: '/401', component: _import('errorPage/401') },
  {
    path: '/',
    component: dashboard,
    redirect: 'home',
    children: [
      { path: '/home', component: _import('home/index'), name: 'home', meta: { title: '首页' }}
    ]
  },
  {
    path: '/edit',
    component: edit,
    // redirect: 'edit',
    children: [
      { path: 'formDesign', component: _import('edit/formDesign/index'), meta: { title: '表单设计' }},
      { path: 'workflowDesign', component: _import('edit/workflowDesign/index'), meta: { title: '流程设计' }},
      { path: 'dataManager', component: _import('edit/dataManager/index'), meta: { title: '流程设计' }}
    ]
  }
]

export default new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  { path: '*', redirect: '/404', hidden: true }
]
