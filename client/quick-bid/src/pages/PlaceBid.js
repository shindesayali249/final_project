import { useParams } from 'react-router-dom';
import { useForm, useFormState } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import useAI2 from '../hooks/useAI2.js';

function PlaceBid() {
    const { id } = useParams();
    const { register, handleSubmit, setValue, control, watch } = useForm({
        defaultValues: {
            bid_amount: '',
        },
    });
    const { errors } = useFormState({ control });
    const auth = useAuth();
    const nav = useNavigate();
    const AI2 = useAI2();

    const [auctionItem, setAuctionItem] = useState(null);

    useEffect(() => {
        const fetchAuctionItem = async () => {
            try {
                const response = await AI2.get(`/auctions/${id}/`);
                if (response.status === 200) {
                    setAuctionItem(response.data);
                }
            } catch (e) {
                console.log(e);
            }
        };

        fetchAuctionItem();
    }, [id, AI2]);

    const placeUserBid = async (data) => {
        try {
            const response = await AI2.post(`/place_bid/${id}/`, data);
            if (response.status === 201) {
                nav("/home/");
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

    return (
        <div className="container mt-5">
            {auctionItem ? (
                <div className="row">
                    {/* Auction Details Section */}
                    <div className="col-md-6 offset-md-3 card p-4">
                        <h2 className="text-center mb-4">{auctionItem.title}</h2>
                        <p>{auctionItem.description}</p>
                        <p><strong>Starting Bid:</strong> ₹{auctionItem.starting_bid}</p>
                        <p><strong>Current Bid:</strong> ₹{auctionItem.current_bid}</p>
                        <p><strong>Ends on:</strong> {new Date(auctionItem.end_time).toLocaleString()}</p>

                        {/* Bid Amount Form */}
                        <form onSubmit={handleSubmit(placeUserBid)}>
                            <div className="mb-3">
                                <label htmlFor="bid_amount" className="form-label">Bid Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    id="bid_amount"
                                    className="form-control"
                                    {...register("bid_amount", {
                                        required: "Bid amount is required",
                                        min: {
                                            value: auctionItem.current_bid + 0.01,
                                            message: `Bid must be greater than the current bid of ₹${auctionItem.current_bid}`
                                        }
                                    })}
                                />
                                {errors.bid_amount && <p className="text-danger mt-2">{errors.bid_amount.message}</p>}
                            </div>

                            <div className="text-center">
                                <button type="submit" className="btn btn-primary">Place Bid</button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <p>Loading auction details...</p>
                </div>
            )}
        </div>

    );
}

export default PlaceBid;
