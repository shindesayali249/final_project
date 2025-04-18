import React, { useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import useAI2 from '../hooks/useAI2.js'
import { NavLink, useNavigate, useParams } from 'react-router-dom'

function DeleteAuction() {
    const { auctionId } = useParams()
    const auth = useAuth()
    const AI2 = useAI2()
    const nav = useNavigate()
    const [auction, setauction] = useState(null)

    useEffect(() => {
        async function fetchAuction() {
            try {
                const res = await AI2.get(`/auctions/${auctionId}/`)
                setauction(res.data)
            } catch (error) {
                console.log(error)
                alert('Error loading auction.')
            }
        }
        fetchAuction()
    }, [auctionId])

    async function deleteauction() {
        try {
            const res = await AI2.delete(`/auction/delete/${auctionId}/`)
            if (res.status === 204) {
                alert('Auction Deleted Successfully...!')
                nav('/home/')
            }
        } catch (e) {
            console.log(e)
            alert('Something went wrong..!')
        }
    }

    return (
        <div className='container mx-auto p-4 ps-5 pe-5 rounded mt-4' style={{ width: '60%' }}>
            <h2 className='text-center mb-4'>Delete Auction</h2>

            {
                auction ? (
                    <h1 className='text-center mb-4'>
                        Are You Sure To Delete <strong>{auction.title}</strong> Auction?
                    </h1>
                ) : (
                    <h5 className='text-center'>Loading auction details...</h5>
                )
            }

            <button
                type='button'
                onClick={deleteauction}
                className='btn btn-danger btn-sm col-5 mt-3'
            >
                Delete
            </button>
            <NavLink
                to={'/home/'}
                className='btn btn-warning btn-sm col-5 float-end mt-3'
            >
                Cancel
            </NavLink>
        </div>
    )
}

export default DeleteAuction
