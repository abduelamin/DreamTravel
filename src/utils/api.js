import axios from 'axios'

export default  axios.create({
    baseURL: 'http://localhost:8000/api' // ensure you use the same port in the backend. This URL will change to the deployed backend URL
})
