import { useParams } from 'react-router-dom';
import { useForm, useFormState } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import useAI2 from '../hooks/useAI2.js';

function Payment() {
    const { id } = useParams();
    const { register, handleSubmit } = useForm();
    const auth = useAuth();
    const nav = useNavigate();
    const AI2 = useAI2();

    const [winnerItem, setWinnerItem] = useState(null);

    useEffect(() => {
        const fetchWinnerItem = async () => {
            try {
                const response = await AI2.get(`/winner/${id}/`);
                if (response.status === 200) {
                    console.log(response.data);
                    setWinnerItem(response.data);
                }
            } catch (e) {
                console.log(e);
            }
        };

        fetchWinnerItem();
    }, [id, AI2]);

    const placePayment = async (data) => {
        try {
            const response = await AI2.post(`/payment/${id}/`, data);
            if (response.status === 201) {
                nav("/auctionswon/");
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
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow-lg" style={{ width: '40%' }}>
                <div className="card-body">
                    <h4 className="card-title text-center mb-4">Payment</h4>
                    <form onSubmit={handleSubmit(placePayment)} id="paymentForm" className="row g-3" encType="multipart/form-data">
                        <>
                            {/* Displaying Title (Non-editable) */}
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label className="form-label">Title : </label>
                                    <input
                                        type="text"
                                        value={winnerItem ? winnerItem.auction_item.title : ''}
                                        className="form-control"
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Displaying Bid Amount (Non-editable) */}
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label className="form-label">Bid Amount : </label>
                                    <input
                                        type="text"
                                        value={winnerItem ? winnerItem.bid_amount : ''}
                                        className="form-control"
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Address 1 */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Address1 : <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        {...register('address1')}
                                        placeholder="Enter your address line 1"
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </div>

                            {/* City */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">City : <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        {...register('city')}
                                        placeholder="Enter your city"
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </div>

                            {/* State */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">State : <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        {...register('state')}
                                        placeholder="Enter your state"
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Phone : <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        {...register('phone')}
                                        placeholder="Enter your contact phone"
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-md-12 text-center">
                                <button className="btn btn-outline-success w-100 mt-3">Pay</button>
                            </div>
                        </>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Payment;
