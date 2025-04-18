import { AI } from "../utils/AxiosInstance";
import useAuth from "./useAuth";


export default function useRefreshToken() {
    const { setAccessToken, setCSRFToken, setLoggedIn } = useAuth()

    const refresh = async ( ) => {
        try{
            const response = await AI.post('/refresh/')
            setAccessToken(response.data.access)
            setCSRFToken(response.headers["x-csrftoken"])

            return { accessToken: response.data.access, 
                     csrfToken: response.headers["x-csrftoken"] 
                }
        }
        catch(e) {
            console.log(e)
            setLoggedIn(false)
        }
        return {}
    }

    return refresh
}