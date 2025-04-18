import useAuth from '../hooks/useAuth'
import {NavLink} from 'react-router-dom'


function Account(){
  const { user } = useAuth()

  return(
    <>
      <div className='container p-2'>
        <h3>--Account---{user?.username}--{user?.email}</h3>
        <NavLink to={`/changepw/`} >Change Password</NavLink>
        
        <NavLink to={`/deleteuser/`} style={{ marginLeft : '50px' }}>Delete User</NavLink>
      </div>
    </>
  )
}

export default Account