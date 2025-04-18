// SellerDashboard.js

import React, { useEffect, useState } from 'react';
import useAI2 from '../hooks/useAI2.js';
import { NavLink, useNavigate } from 'react-router-dom';

function SellerDashboard() {
    const [auctions, setAuctions] = useState([]);
    const AI2 = useAI2();
    const nav = useNavigate()
    const goToAuctionDetail = (id) => {
        nav(`/auctiondetails/${id}`); // Navigating to auction detail page
    };

    
    const endAuction = async (id) => {
        try {
            const response = await AI2.post(`/auctionwinner/${id}/`);
            if (response.status === 201) {
                alert('Auction Ended');
                nav('/seller/dashboard/')
            }
        } catch (e) {
            console.log(e);
            if (e.response) {
                const errorMessage = e.response.data || "Something went wrong. Please try again.";
                alert(errorMessage);  // Show the error message to the user
            } else {
                alert("An unknown error occurred. Please try again later.");
            }
        }
    };
    

    useEffect(() => {
        const fetchSellerAuctions = async () => {
            try {
                const res = await AI2.get('/myauctions/'); // Make sure this endpoint exists
                setAuctions(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSellerAuctions();
    }, [AI2]);

    return (
        <div className="container mt-4">
            <h3>My Auction Items</h3>
            <div className="row">
                {auctions.map(item => (
                    <div className="col-md-4 mb-3" key={item.id}>
                        <div className="card h-100">
                            <img src={item.image} className="card-img-top" alt={item.title} />
                            <div className="card-body">
                                <h4 className="card-title">{item.title}</h4>
                                <p className="card-text"><strong>Current Bid :</strong> ${item.current_bid}</p>

                                <h5>{item.payment_done ? (
                                    <span className="badge bg-success mt-3">Paid</span>
                                ) : (
                                    <span className="badge bg-danger text-dark mt-3">Pending Payment</span>
                                )}</h5>

                                <div className="d-flex justify-content-between">
                                    {item.status == 'live' ?(
                                    <button type="button" className="btn btn-sm btn-danger"
                                    onClick={() => endAuction(item.id)}> End </button>
                                        ):
                                    <div></div>}
                                    <button type="button" className="btn btn-sm btn-info" 
                                    onClick={() => goToAuctionDetail(item.id)}> Details
                                    </button>
                                    
                                </div>
                            </div>
                           
                            
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ✅ This is what was likely missing
export default SellerDashboard;
