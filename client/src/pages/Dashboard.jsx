import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useAuth();
    const [deals, setDeals] = useState([]);
    const [activeTab, setActiveTab] = useState('marketplace'); // marketplace, my-deals
    const [loading, setLoading] = useState(true);

    const fetchDeals = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'marketplace' ? '/deals' : '/deals/mine';
            const res = await api.get(endpoint);
            setDeals(res.data.data);
        } catch (error) {
            toast.error('Failed to load deals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeals();
    }, [activeTab]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'created': return <span className="badge badge-green">Available</span>;
            case 'awaiting_payment': return <span className="badge badge-yellow">Pending Payment</span>;
            case 'in_escrow': return <span className="badge badge-blue">In Escrow</span>;
            case 'meetup_scheduled': return <span className="badge badge-blue">Meetup Scheduled</span>;
            case 'awaiting_buyer_confirmation': return <span className="badge badge-yellow">Awaiting Confirmation</span>;
            case 'completed': return <span className="badge badge-green" style={{ color: '#3fb950' }}>Completed</span>;
            case 'cancelled': return <span className="badge badge-gray">Cancelled</span>;
            case 'disputed': return <span className="badge badge-red">Disputed</span>;
            default: return <span className="badge badge-gray">{status}</span>;
        }
    };

    return (
        <div className="container">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl">Dashboard</h1>
                {user.role !== 'buyer' && (
                    <Link to="/create-deal" className="btn btn-primary">Create New Deal</Link>
                )}
            </div>

            <div className="flex gap-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <button
                    className={`btn ${activeTab === 'marketplace' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('marketplace')}
                >
                    Marketplace
                </button>
                <button
                    className={`btn ${activeTab === 'my-deals' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('my-deals')}
                >
                    My Deals
                </button>
            </div>

            {loading ? (
                <div className="text-center py-8 text-secondary">Loading deals...</div>
            ) : deals.length === 0 ? (
                <div className="card text-center py-8">
                    <p className="text-secondary mb-4">No deals found.</p>
                    {activeTab === 'marketplace' && user.role !== 'buyer' && (
                        <Link to="/create-deal" className="btn btn-primary">Create the first deal</Link>
                    )}
                </div>
            ) : (
                <div className="dashboard-grid">
                    {deals.map(deal => (
                        <div key={deal._id} className="card">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-secondary font-bold" style={{ textTransform: 'uppercase' }}>{deal.category}</span>
                                {getStatusBadge(deal.status)}
                            </div>
                            <h3 className="text-xl mb-2">
                                <Link to={`/deals/${deal._id}`} style={{ color: 'inherit' }}>{deal.title}</Link>
                            </h3>
                            <p className="text-2xl font-bold mb-4" style={{ color: 'var(--accent-color)' }}>
                                {deal.price.toLocaleString('en-IN', { style: 'currency', currency: deal.currency })}
                            </p>
                            <div className="flex justify-between text-sm text-secondary mb-4">
                                <span>📍 {deal.city}</span>
                                <span>Seller: {deal.seller?.name || 'Unknown'}</span>
                            </div>
                            <Link to={`/deals/${deal._id}`} className="btn btn-secondary" style={{ width: '100%' }}>
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
