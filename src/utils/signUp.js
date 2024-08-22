
import api from "./api"


export const signUp = async (user, profileImage) => {
const userData = new FormData()

userData.append('firstName', user.firstName)
userData.append('lastName', user.lastName)
userData.append('email', user.email)
userData.append('password', user.password)
userData.append('profileImage', profileImage)

// Chnage the url to correct one once BE created
return await api.post('BACKENDURL', userData)
}