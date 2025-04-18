import {NavLink,useNavigate} from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useAI2 from '../hooks/useAI2'
import useForceLogout from "../hooks/useForceLogout"


function Navbar(){
	const nav = useNavigate()
	const auth = useAuth()
  	const AI2 = useAI2()
	const forceLogout = useForceLogout()


	async function logoutUser () {
		if ( window.confirm(`Do you wants log out ?`) ){
			try{
		    	await forceLogout()
		  	}
		    catch(e){
		    	console.log(e)
	    	}
	    	finally {
	            nav(`/login/`)
	        }
	    }
	}


	return(
		<>

			<nav className="navbar navbar-expand-lg" id='Navbar'>
			  <div className="container-fluid">
			    <NavLink className="navbar-brand" to="/">Persons</NavLink>
			    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
			      <span className="navbar-toggler-icon"></span>
			    </button>
			    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
			      <div className="navbar-nav">
			        <NavLink className="nav-link active ps-3 pe-3" aria-current="page" to="/home/"><i className="bi bi-house-fill"></i> Home</NavLink>
					<NavLink className="nav-link ps-3 pe-3" to="/createAuction/"><i class="bi bi-plus-square"></i>Create Auction</NavLink>
					<NavLink className="nav-link ps-3 pe-3" to="/watchlist/"><i class="bi bi-list-columns-reverse"></i>Watchlist</NavLink>
					<NavLink className="nav-link ps-3 pe-3" to="/seller/dashboard/"><i class="bi bi-person-lines-fill"></i> Dashboard</NavLink>
					<NavLink className="nav-link ps-3 pe-3" to="/seller/notifications/"><i class="bi bi-stopwatch"></i> Notification</NavLink>
					<NavLink className="nav-link ps-3 pe-3" to="/auctionswon/"><i class="bi bi-emoji-laughing"></i> Auction Won</NavLink>
					

			      </div>

			      <div className="navbar-nav ms-auto">	
					{
						auth.loggedIn ?
						<>
							<NavLink className="nav-link" to={`/account/`}>{auth?.user?.username}</NavLink>
							<NavLink className="nav-link" onClick={logoutUser}><i className="bi bi-box-arrow-in-right"></i>Logout</NavLink>
						</>
						:
						<>
							<NavLink className="nav-link" to="/login/"><i className="bi bi-box-arrow-in-left"></i>Login</NavLink>
							<NavLink className="nav-link" to="/signup/"><i className="bi bi-person-fill-add"></i>SignUp</NavLink>	
						</>

					}			
                    
				
					
			      </div>
			    </div>
			  </div>
			</nav>
		</>
	)
}


export default Navbar
















