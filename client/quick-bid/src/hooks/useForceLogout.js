import { AI } from "../utils/AxiosInstance";
import useAuth from "./useAuth";
import useAI2 from "./useAI2"


export default function useForceLogout() {
    const auth = useAuth()
    const AI2 = useAI2()

    const forceLogout = async ( ) => {
        try{
            const res = await AI2.post('/logout/')
            console.log( res )
          }
        catch(e){
            console.log(e)
        }
        finally {
            auth.setUser({id:null,username:null})
            auth.setAccessToken(null)
            auth.setCSRFToken(null)
            auth.setLoggedIn(false)
        }
    }

    return forceLogout
}
