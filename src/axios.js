import axios from 'axios'

const baseURL = 'https://atms-backend.herokuapp.com/api/v1/'
export default axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization':'Bearer '+JSON.parse(localStorage.getItem('TOKEN')),
 },
  withCredentials:true
})
