/* eslint-disable no-unused-vars */
import api from "./api"
import Cookies from "js-cookie";

export const createNewAccessToken = async () => {
    try {
        const response = await api.post('/refresh-token')
        const token = Cookies.get("accessToken")
        return token
    } catch (error) {
        console.log(error)
        window.location.href = '/login'
    }
}