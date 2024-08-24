
import api from "./api"


export const signUp = async (user, profileImage) => {
const userData = new FormData()

userData.append('firstname', user.firstname)
userData.append('lastname', user.lastname)
userData.append('email', user.email)
userData.append('password', user.password)
userData.append('profileImage', profileImage)

console.log("userData:", userData);

// Chnage the url to correct one once BE created
return await api.post('/register', userData)
}


// QUESTION: user.email where is that coming from? When we hadnlesubmit is the .fristname coming from the name I used to register the input field via Reacthookform?