import { useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import useAI2 from '../hooks/useAI2'
import { useNavigate, NavLink, useParams } from 'react-router-dom'
import { formatDate } from '../utils/DateFormat'

function Home() {
  const auth = useAuth()
  const [auctionData, setAuctionData] = useState([])
  const nav = useNavigate()
  const AI2 = useAI2()


  function handleBidClick(pk) {
    nav(`/placebid/${pk}`); // Navigate to the update page with task id
  }

  const goToAuctionDetail = (id) => {
    nav(`/auctiondetails/${id}`); // Navigating to auction detail page
  };

  async function getAuctionData() {
    try {
      const res = await AI2.get(`/auctions/`)
      if (res.status == 200) {
        console.log(res)
        setAuctionData(res.data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => { getAuctionData() }, [])

  return (
    <>
      <table className="table table-striped mx-auto mt-3 ">
        <thead className='table-info'>
          <tr>
            <td>Id</td>
            <td>Title</td>
            <td>Starting_bid</td>
            <td>Current_bid</td>
            <td>Image</td>
            <td>Created At</td>
            <td>End Time</td>
            <td>Updated At</td>
            <td>Category</td>
            <td>Seller</td>
            <td>Bid</td>
            <td>Details</td>
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {
            auctionData.map(e => <tr key={e.id}>

              <td>{e.id}</td>
              <td>{e.title}</td>
              <td>{e.starting_bid}</td>
              <td>{e.current_bid}</td>
              <td>
                <img src={e.image} alt="item image" width="50" height="40" />
              </td>
              <td>{formatDate(e.created_at)}</td>
              <td>{formatDate(e.end_time)}</td>
              <td>{formatDate(e.updated_at)}</td>
              
              <td>{e.category.name}</td>
              <td>{e.seller}</td>
              <td>
                {e.seller != auth.user.username ? <button type="button" className="btn btn-sm btn-success"
                  onClick={() => handleBidClick(e.id)} >Bid</button>
                :
                <div></div>}
                
              </td>
              <td>
                <button type="button" className="btn btn-sm btn-info"
                  onClick={() => goToAuctionDetail(e.id)}>Details</button>
              </td>

            </tr>

            )
          }
        </tbody>
      </table>
    </>
  )
}


export default Home