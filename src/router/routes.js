import store from '@/state/store'

export default [
  {
    path: '/',
    name: 'default',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/dashboards/default'),
  },
  {
    path: '/customers/update/:id',
    name: 'customersupdate',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/customers/update'),
  },
  {
    path: '/customers/list',
    name: 'customerslist',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/customers/list'),
  },
  {
    path: '/customers/create',
    name: 'customerscreate',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/customers/create'),
  },

  {
    path: '/employees/update/:id',
    name: 'employeesupdate',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/employees/update'),
  },
  {
    path: '/employees/list',
    name: 'employeeslist',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/employees/list'),
  },
  {
    path: '/employees/create',
    name: 'employeescreate',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/employees/create'),
  },

  {
    path: '/vehicles/update/:id',
    name: 'vehiclesupdate',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/vehicles/update'),
  },
  {
    path: '/vehicles/list',
    name: 'vehicleslist',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/vehicles/list'),
  },
  {
    path: '/vehicles/create',
    name: 'vehiclescreate',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/vehicles/create'),
  },

  {
    path: '/agencies/update/:id',
    name: 'agenciesupdate',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/agencies/update'),
  },
  {
    path: '/agencies/list',
    name: 'agencieslist',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/agencies/list'),
  },
  {
    path: '/agencies/create',
    name: 'agenciescreate',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/agencies/create'),
  },

  {
    path: '/vehicletypes/update/:id',
    name: 'vehicletypesupdate',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/vehicletypes/update'),
  },
  {
    path: '/vehicletypes/list',
    name: 'vehicletypeslist',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/vehicletypes/list'),
  },
  {
    path: '/vehicletypes/create',
    name: 'vehicletypescreate',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/vehicletypes/create'),
  },

  {
    path: '/users/update/:id',
    name: 'usersupdate',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/users/update'),
  },
  {
    path: '/users/list',
    name: 'userslist',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/users/list'),
  },
  {
    path: '/users/create',
    name: 'userscreate',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/users/create'),
  },

  {
    path: '/points/update/:id',
    name: 'pointsupdate',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/points/update'),
  },
  {
    path: '/points/list',
    name: 'pointslist',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/points/list'),
  },
  {
    path: '/points/create',
    name: 'pointscreate',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/points/create'),
  },

  {
    path: '/airports/update/:id',
    name: 'airportsupdate',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/airports/update'),
  },
  {
    path: '/airports/list',
    name: 'airportslist',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/airports/list'),
  },
  {
    path: '/airports/create',
    name: 'airportscreate',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/airports/create'),
  },

  {
    path: '/rezervations/update/:id',
    name: 'rezervationsupdate',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/rezervations/update'),
  },
  {
    path: '/rezervations/list',
    name: 'rezervationslist',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/rezervations/list'),
  },
  {
    path: '/rezervations/create',
    name: 'rezervationscreate',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/rezervations/create'),
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('./views/account/login'),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the home page instead
          next({ name: 'default' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./views/account/register'),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the home page instead
          next({ name: 'default' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/forgot-password',
    name: 'Forgot password',
    component: () => import('./views/account/forgot-password'),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the home page instead
          next({ name: 'default' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/logout',
    name: 'logout',
    meta: {
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
          store.dispatch('auth/logOut')
        } else {
          store.dispatch('authfack/logout')
        }
        const authRequiredOnPreviousRoute = routeFrom.matched.some(
          (route) => route.push('/login')
        )
        // Navigate back to previous page, or home as a fallback
        next(authRequiredOnPreviousRoute ? { name: 'default' } : { ...routeFrom })
      },
    },
  },
 
  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
 
]
