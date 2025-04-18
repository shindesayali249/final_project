import React, { useEffect, useState } from 'react';
import useAI2 from '../hooks/useAI2';
import { useNavigate, NavLink, useParams } from 'react-router-dom'

function AuctionDetail() {
    const { id } = useParams();  // Get auction ID from URL params
    const [auctionItem, setAuctionItem] = useState(null);
    const AI2 = useAI2();
    const nav = useNavigate();
    const [isInputVisible, setInputVisible] = useState(false);
    const [commentText, setCommentText] = useState('');
    

    async function AddToWatchList(id) {
        const data = {"auction": id }
        try {
            const response = await AI2.post('/watchlist/',data);
            console.log(response);
            if (response.status === 201) {

                nav("/watchlist/");
            }
        } catch (e) {
            console.log(e);
        }

    }

    async function Comments(id,comment) {
        const data = {"auction": id , "content":comment }
        try {
            const response = await AI2.post('/comments/',data);
            console.log(response);
            if (response.status === 201) {
                setInputVisible(false);
                setCommentText('');
                
            }
        } catch (e) {
            console.log(e);
        }

    }

    const toggleInputVisibility = () => {
        setInputVisible(!isInputVisible);
    };

    const handleCommentChange = (e) => {
        setCommentText(e.target.value);
    };

    const handleCancel = () => {
        setInputVisible(false);
        setCommentText('');
    };

    const handleCommentSubmit = () => {
        if (commentText.trim() === '') {
            alert('Please enter a comment!');
            return;
        }
        Comments(id, commentText);
    };



    useEffect(() => {
        const fetchAuctionDetail = async () => {
            try {
                const response = await AI2.get(`/auctions/${id}/`);
                if (response.status === 200) {
                    setAuctionItem(response.data);
                }
            } catch (e) {
                console.log(e);
            }
        };

        fetchAuctionDetail();
    }, [id, AI2]);

    if (!auctionItem) {
        return <p>Loading auction details...</p>;
    }

    return (
        <div className="container mt-4">
            <h3 className="text-center mb-4">Auction Details</h3>
            <div className="card shadow-sm">
                <div className="card-body">
                    <h2 className="card-title text-success">{auctionItem.title}</h2>
                    <p className="card-text"><strong>Description:</strong> {auctionItem.description}</p>
                    <p className="card-text"><strong>Starting Bid:</strong> <span className="text-danger">${auctionItem.starting_bid}</span></p>
                    <p className="card-text"><strong>Current Bid:</strong> <span className="text-success">${auctionItem.current_bid}</span></p>
                    <p className="card-text"><strong>End Time:</strong> {new Date(auctionItem.end_time).toLocaleString()}</p>
                    <p className="card-text"><strong>Seller:</strong> {auctionItem.seller}</p>
                    <img src={auctionItem.image} alt={auctionItem.title} className="img-fluid rounded mb-3 text-center" />
                    <p className="card-text"><strong>Category:</strong> {auctionItem.category.name}</p>
                    <p className="card-text"><strong>Status:</strong> <span className={`badge ${auctionItem.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>{auctionItem.status}</span></p>
                    <NavLink to={`/auction/delete/${auctionItem.id}`} className={'btn btn-danger btn-sm float-end col-2'}>Delete</NavLink>
                            
                
                    <div className="d-flex gap-3 mt-3">
                        <button onClick={() => AddToWatchList(auctionItem.id)} type="button" className="btn btn-outline-dark">Add to Watchlist</button>
                        <button onClick={toggleInputVisibility} className="btn btn-outline-primary">Add a Comment...</button>
                    </div>
        
                    {/* Comment input box */}
                    {isInputVisible && (
                        <div className="comment-input-box mt-3 p-3 border rounded shadow-sm">
                            <textarea
                                value={commentText}
                                onChange={handleCommentChange}
                                placeholder="Write your comment here..."
                                rows="4"
                                className="form-control mb-2"
                            />
                            <div className="d-flex justify-content-end">
                                <button onClick={handleCancel} className="btn btn-secondary me-2">Cancel</button>
                                <button onClick={handleCommentSubmit} className="btn btn-primary">Comment</button>
                            </div>
                        </div>
                    )}
                    
                </div>
            </div>
    
            <div className="mt-4">
                <h3 className="text-info">Comments</h3>
                {auctionItem.comments && auctionItem.comments.length > 0 ? (
                    auctionItem.comments.map((comment) => (
                        <div key={comment.id} className="comment mb-3 p-3 border rounded shadow-sm">
                            <p className="mb-1"><strong>{comment.commenter}</strong> <em>{new Date(comment.created_at).toLocaleString()}</em></p>
                            <p>{comment.content}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-muted">No comments yet.</p>
                )}
            </div>
        </div>
    );
    
}

export default AuctionDetail;