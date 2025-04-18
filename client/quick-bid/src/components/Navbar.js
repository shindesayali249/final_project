import {NavLink,useNavigate} from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useAI2 from '../hooks/useAI2'
import useForceLogout from "../hooks/useForceLogout"
import Images from '../Images/auction2.png'


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
				<ul>
			<li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
			<img src={Images} alt="Home" style={{ width: '60px', height: '60px' }} />
			<h2><b>Online Auction</b></h2>
			</li></ul>

			  <div className="container-fluid bg-dark">
			    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
			      <div className="navbar-nav">
			        <NavLink className="nav-link active ps-3 pe-3 text-white" aria-current="page" to="/home/"><i className="bi bi-house-fill"></i> Home</NavLink>
					<NavLink className="nav-link ps-3 pe-3 text-white" to="/createAuction/"><i class="bi bi-plus-square"></i> Create Auction</NavLink>
					<NavLink className="nav-link ps-3 pe-3 text-white" to="/watchlist/"><i class="bi bi-bag-heart"></i> Watchlist</NavLink>
					<NavLink className="nav-link ps-3 pe-3 text-white" to="/seller/dashboard/"><i class="bi bi-person-lines-fill"></i> Dashboard</NavLink>
					<NavLink className="nav-link ps-3 pe-3 text-white" to="/seller/notifications/"><i class="bi bi-bell-fill"></i> Notification</NavLink>
					<NavLink className="nav-link ps-3 pe-3 text-white" to="/auctionswon/"><i class="bi bi-emoji-laughing"></i> Auction Won</NavLink>
					

			      </div>

			      <div className="navbar-nav ms-auto">	
					{
						auth.loggedIn ?
						<>
							<NavLink className="nav-link text-white" to={`/account/`}>{auth?.user?.username}</NavLink>
							<NavLink className="nav-link text-white" onClick={logoutUser}><i className="bi bi-box-arrow-in-right"></i>Logout</NavLink>
						</>
						:
						<>
							<NavLink className="nav-link text-white" to="/login/"><i className="bi bi-box-arrow-in-left"></i>Login</NavLink>
							<NavLink className="nav-link text-white" to="/signup/"><i className="bi bi-person-fill-add"></i>SignUp</NavLink>	
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
















