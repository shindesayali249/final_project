import "./css/App.css"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.min.js"
import "../node_modules/bootstrap-icons/font/bootstrap-icons.min.css"
import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import Error404 from './pages/Error404'
import AuthContext from "./store/AuthContext.js"
import PersistLogin from "./components/PersistLogin.js"
import Account from './pages/Account.js'
import ForgotPw from './pages/ForgotPw.js'
import ChangePw from './pages/ChangePw.js'
import DeleteUser from "./pages/DeleteUser.js"
import CreateAuction from "./pages/CreateAuction.js"
import PlaceBid from "./pages/PlaceBid.js"
import AuctionDetail from "./pages/AuctionDetail.js"
import WatchList from "./pages/WatchList.js"
import Auctionwinner from "./pages/AuctionWinner.js"
import Payment from "./pages/Payment.js"
import DeleteAuction from "./pages/DeleteAuction.js"
import SellerNotifications from "./pages/SellerNotifications.js"
import SellerDashboard from "./pages/SellerDashboard.js"

function App() {
  const [user, setUser] = useState({
    id: null,
    username: null
  })
  const [accessToken, setAccessToken] = useState()
  const [refreshToken, setRefreshToken] = useState()
  const [csrftoken, setCSRFToken] = useState()
  const [loggedIn, setLoggedIn] = useState(false)


  return (
    <>
      <AuthContext.Provider value={{
        user, setUser,
        accessToken, setAccessToken,
        refreshToken, setRefreshToken,
        csrftoken, setCSRFToken,
        loggedIn, setLoggedIn
      }}>
        <div className="App">
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<PersistLogin />} >
                <Route path={'/createAuction/'}
                  element={loggedIn ? <CreateAuction /> : <Navigate to={`/login/`} />}
                />

                <Route path={'/'} element={<Login />} />
                <Route path={'/home/'} element={<Home />} />
                <Route path={'/signup/'} element={<SignUp />} />
                <Route path={'/login/'} element={<Login />} />
                <Route path={'/account/'} element={<Account />} />
                <Route path={'/forgotpw/'} element={<ForgotPw />} />
                <Route path={'/changepw/'} element={<ChangePw />} />
                <Route path={'/deleteuser/'} element={<DeleteUser />} />
                <Route path={'/placebid/:id'} element={<PlaceBid />} />
                <Route path="/auctiondetails/:id" element={<AuctionDetail />} />
                <Route path="/watchlist/" element={<WatchList />} />
                <Route path="/auctionswon/" element={<Auctionwinner />} />
                <Route path="/payment/:id" element={<Payment />} />
                <Route path={`/auction/delete/:auctionId`}  
                    element={ loggedIn ? <DeleteAuction/> : <Navigate to={`/login/`}/> } 
                  />
              </Route>
              <Route path="/seller/dashboard/" element={<SellerDashboard />} />
              <Route path="/seller/notifications/" element={<SellerNotifications />} />
        
              <Route path={'*'} element={<Error404 />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthContext.Provider>
    </>
  );
}

export default App;
