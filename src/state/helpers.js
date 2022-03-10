import { mapState, mapGetters, mapActions } from 'vuex'

export const authComputed = {
  ...mapState('auth', {
    currentUser: (state) => state.currentUser,
  }),
  ...mapGetters('auth', ['loggedIn']),
}

export const layoutComputed = {
  ...mapState('layout', {
    layoutType: (state) => state.layoutType,
    leftSidebarType: (state) => state.leftSidebarType,
    layoutWidth: (state) => state.layoutWidth,
    topbar: (state) => state.topbar,
    loader: (state) => state.loader
  })
}

export const formatShortDate = (date) => {
  return new Date(date.slice(0, 4), date.slice(5, 7), date.slice(8, 10))
}

export const authMethods = mapActions('auth', ['logIn', 'logOut', 'register', 'resetPassword'])

export const layoutMethods = mapActions('layout', ['changeLayoutType', 'changeLayoutWidth', 'changeLeftSidebarType', 'changeTopbar', 'changeLoaderValue'])

export const authFackMethods = mapActions('authfack', ['login', 'registeruser', 'logout'])

export const notificationMethods = mapActions('notification', ['success', 'error', 'clear'])


export const todoComputed = {
  ...mapState('todo', {
    todos: (state) => state.todos
  })
}
export const todoMethods = mapActions('todo', ['fetchTodos'])


export const authenticationMethod = mapActions('authentication', ['login']);

export const customerMethod = mapActions('customer', ['createCustomer', 'fetchCustomers', 'fetchCountries', 'updateCustomer', 'fetchCustomer']);

export const employeeMethod = mapActions('employee', ['createEmployee', 'fetchEmployees', 'fetchCountries', 'fetchEmployee', 'updateEmployee']);

export const vehicleMethod = mapActions('vehicle', ['createVehicle', 'fetchVehicles','fetchVehicle','updateVehicle']);

export const agencyMethod = mapActions('agency', ['createAgency', 'fetchAgencies','fetchAgency','updateAgency']);

export const vehicleTypeMethod = mapActions('vehicletype', ['createVehicleType', 'fetchVehicleTypes','fetchVehicleType','updateVehicleType']);

export const userMethod = mapActions('user', ['createUser','fetchUsers','fetchUser','updateUser']);

export const pointMethod = mapActions('point', ['fetchCities','createPoint','fetchPoints','fetchPoint','updatePoint']);

export const airportMethod = mapActions('airport', ['fetchAirports','createAirport','fetchAirport','fetchUetdsAirports','updateAirport']);

export const taxationMethod = mapActions('taxation', ['fetchTaxation','updateTaxation']);  

export const rezervationMethod = mapActions('rezervation', ['fetchRezervations','createRezervation','fetchRezervation','updateRezervation','updateVehicleOfRezervation','setEmployeeOfRezervation','removeEmployeeOfRezervation']); 

export const uetdsMethod = mapActions('uetds', ['sendNotification','cancelNotification','printOut']);  