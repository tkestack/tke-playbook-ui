import { createRouter, createWebHashHistory } from 'vue-router'

// 导入页面组件
const Home = () => import('../view/Home.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页'
    }
  },
  // 通配符路由，处理所有未匹配的路径，重定向到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Playbook Door`
  }
  next()
})

// 处理Giscus登录后返回的情况
router.afterEach((to, from) => {
  // 检查是否是OAuth回调
  const searchParams = new URLSearchParams(window.location.search);
  const hasOAuthParams = searchParams.has('code') || searchParams.has('state') || searchParams.has('error');
  
  // 如果URL包含giscus相关的参数或者是OAuth回调，保留参数让Giscus处理
  if (!(window.location.search && window.location.search.includes('giscus')) && !hasOAuthParams) {
    // 只有在不是Giscus相关的情况下才清除search参数
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
    }
  }
})

export default router
