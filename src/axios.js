import axios from 'axios'

const baseURL = 'http://localhost:4848/api/v1/'
export default axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkN2E1MTRiNWQyYzEyYzc0NDliZTA0MiIsImlhdCI6MTYyMDM3NjA2OSwiZXhwIjoxNjIyOTY4MDY5fQ.jv0Cabarta4cOVcH2HSNct3ChKEVYvcEe3E2vpVP3RQ',
 },
  withCredentials:true
})
