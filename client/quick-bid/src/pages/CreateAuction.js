import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';
import useAI2 from '../hooks/useAI2.js';

function CreateAuction() {
    const { register, handleSubmit, setValue } = useForm();
    const auth = useAuth();
    const nav = useNavigate();
    const AI2 = useAI2();

    const [categories, setCategories] = useState([]);
    const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    // Handle form submission for auction
    async function CreateUserAuction(data) {
        data.image = data.image[0]; // Handle file input
        console.log(data);
        try {
            const response = await AI2.post('/auctionscreate/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response);
            if (response.status === 201) {
                nav("/home/");
            }
        } catch (e) {
            console.log(e);
        }
    }

    // Fetch categories from the API
    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await AI2.get('/categories/');
                if (response.status === 200) {
                    setCategories(response.data);
                }
            } catch (e) {
                console.log(e);
            }
        }

        fetchCategories();
    }, [AI2]);

    // Handle creating a new category
    const handleNewCategorySubmit = async (e) => {
        e.preventDefault();
        if (newCategoryName.trim() === "") return; // Prevent empty category submission
        try {
            const response = await AI2.post('/categories/', { name: newCategoryName });
            if (response.status === 201) {
                setCategories([...categories, response.data]); // Add new category to list
                setValue("category", response.data.id); // Set the new category ID in the form
                setShowNewCategoryForm(false); // Hide the new category form
                setNewCategoryName(""); // Reset input field
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            <div className="p-3 mt-2">
                <div
                    className="mx-auto p-4 ps-5 pe-5 rounded"
                    style={{ width: '50%', background: 'rgb(228, 228, 228)' }}
                >
                    <h3 className="text-center mb-3">Create Auction</h3>
                    <form onSubmit={handleSubmit(CreateUserAuction)} id="taskform" className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Title :<span className="text-danger">*</span></label>
                            <input type="text" {...register('title')} id="task_name-Inp" placeholder="name here.." className="form-control mb-2" required />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Description :<span className="text-danger">*</span></label>
                            <input type="text" {...register('description')} placeholder="description here.." className="form-control mb-2" required />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Starting Bid :<span className="text-danger">*</span></label>
                            <input type="text" {...register('starting_bid')} placeholder="Starting Bid here.." className="form-control mb-2" required />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Item Image:</label>
                            <input type="file"  {...register('image')} className="form-control mb-2" />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Auction End Time :<span className="text-danger">*</span></label>
                            <input type="datetime-local" {...register('end_time')} placeholder="End Time here.." className="form-control mb-2" required />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Category :<span className="text-danger">*</span></label>
                            <select {...register('category')} className="form-control mb-2" required>
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Option to add a new category */}
                        <div className="col-md-12">
                            <button 
                                type="button" 
                                className="btn btn-link" 
                                onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
                            >
                                {showNewCategoryForm ? "Cancel" : "Add New Category"}
                            </button>
                        </div>

                        {/* New Category Form (conditionally rendered) */}
                        {showNewCategoryForm && (
                            <div className="col-md-12">
                                <label className="form-label">New Category Name:</label>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Enter new category name"
                                />
                                <button 
                                    type="button" 
                                    onClick={handleNewCategorySubmit} 
                                    className="btn btn-outline-primary mt-2"
                                >
                                    Add Category
                                </button>
                            </div>
                        )}

                        <div className="col-md-12">
                            <button className="btn btn-outline-success col-4 d-block mt-3 mx-auto">Create Auction</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CreateAuction;
