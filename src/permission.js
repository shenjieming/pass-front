import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getUserInfo } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration
// const whiteList = ['/login', '/authredirect']// no redirect whitelist
/* 处理路由相关信息模块内容*/
router.beforeEach((to, from, next) => {
  // NProgress.start() // start progress bar
  console.log(getUserInfo())
  if (getUserInfo()) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is home will not trigger	afterEach hook, so manually handle it
    }
  }
  next()
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
