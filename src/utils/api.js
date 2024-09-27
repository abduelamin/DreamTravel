import axios from 'axios'

export default  axios.create({
    baseURL: 'https://dreamnest-backend.onrender.com/api',
    withCredentials: true,
})
