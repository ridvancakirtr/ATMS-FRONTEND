import axios from 'axios'

const baseURL = 'http://localhost:4848/api/v1/'
export default axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkN2E1MTRiNWQyYzEyYzc0NDliZTA0MiIsImlhdCI6MTYyMzAwOTg0MCwiZXhwIjoxNjI1NjAxODQwfQ.6a2Yt3cHr7lTwF8_K4go7oF8LHErTB1IncTdH9SgEJQ',
 },
  withCredentials:true
})
