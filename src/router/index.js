import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import routes from './routes'

Vue.use(VueRouter)
Vue.use(VueMeta, {
  keyName: 'page',
})

const router = new VueRouter({
  routes,
  mode: 'history',
  // Simulate native-like scroll behavior when navigating to a new
  // route and using back/forward buttons.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})

// Before each route evaluates...
router.beforeEach((routeTo, routeFrom, next) => {
  const authRequired = routeTo.meta.authRequired
  const token = JSON.parse(localStorage.getItem('TOKEN'));
  const logged = localStorage.getItem('LOGGED');
  if(logged && authRequired && token!=null) {
    next()
  }else if(authRequired==false){
    next()
  }else{
    next('/login')
  }
})

export default router
