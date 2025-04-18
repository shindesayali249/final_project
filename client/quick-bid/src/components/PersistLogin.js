import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import useAI2 from '../hooks/useAI2'
import {useNavigate,Outlet} from 'react-router-dom'
import useRefreshToken from '../hooks/useRefreshToken'


function PersistLogin() {
    const [loading, setLoading] = useState(true)
    const auth = useAuth()
    const AI2 = useAI2()
    const refresh = useRefreshToken()


    useEffect(() => {
        let isMounted = true

        async function verifyUser() {
            try {
                await refresh()
                const res = await AI2.get('/user/info/')
                console.log(res)
                auth.setUser(res.data)
                auth.setLoggedIn(true)
            }
            catch (error) {
                console.log( error ) 
            }
            finally {
                isMounted && setLoading(false)
            }
        }

        !auth.accessToken ? verifyUser() : setLoading(false)

        return ()=>{isMounted = false}
    }, [])

    return (
        loading ? 
        <div className="spinnerOuter"><div className="spinner"></div></div>
        : <Outlet />
    )
}

export default PersistLogin
