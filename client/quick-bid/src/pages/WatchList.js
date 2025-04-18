import React, { useEffect, useState } from 'react';
import useAI2 from '../hooks/useAI2';
import { useNavigate, NavLink, useParams } from 'react-router-dom';

function WatchList() {
    const [WatchlistItems, setWatchlistItems] = useState(null);
    const [TagItems, setTagItems] = useState(null);
    const [categories, setCategories] = useState([]);
    const AI2 = useAI2();
    const nav = useNavigate();

    // Fetch watchlist items
    const fetchWatchlist = async () => {
        try {
            const response = await AI2.get('/watchlist/');
            if (response.status === 200) {
                setWatchlistItems(response.data);  // Replace the state with all data
                console.log(response.data);
            }
        } catch (e) {
            console.log(e);
        }
    };

   
    const fetchTagList = async (tag) => {
        try {
            const response = await AI2.get(`/watchlistfiltter/`, {
                params: { search: tag },
            });
            if (response.status === 200) {
                setWatchlistItems(response.data);  
                console.log(response.data);
            }
        } catch (e) {
            console.log(e);
        }
    };

    // Fetch categories for the tags
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

    // Fetch all watchlist items when the component mounts or when categories change
    useEffect(() => {
        fetchWatchlist();
    }, [AI2]);

    // Handling tag click (filtering watchlist based on tag)
    const handleTagClick = (tag) => {
        if (tag === 'all') {
            fetchWatchlist(); // Fetch all watchlist items when 'All' is clicked
        } else {
            fetchTagList(tag); // Fetch filtered items based on the selected tag
        }
    };

    if (!WatchlistItems) {
        return <p>Loading auction details...</p>;
    }

    return (
        <>
            {/* Display tags */}
            <div className="d-flex justify-content-center gap-3 my-4">
                <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleTagClick('all')}
                >
                    All
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleTagClick(category.name)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
    
            {/* Display Watchlist */}
            <div className="container mt-5">
                <table className="table table-bordered table-hover table-striped shadow-lg rounded">
                    <thead className="table-dark">
                        <tr>
                            <th>Title</th>
                            <th>Current Bid</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>End Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {WatchlistItems.map((e) => (
                            <tr key={e.id}>
                                <td>{e.auction.title}</td>
                                <td>{e.auction.current_bid}</td>
                                <td>{e.auction.category.name}</td>
                                <td>{e.auction.status}</td>
                                <td>{e.auction.end_time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
    
}

export default WatchList;
