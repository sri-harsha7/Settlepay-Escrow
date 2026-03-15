import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { AlertCircle, CheckCircle, Shield, Handshake } from 'lucide-react';

const DealDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [deal, setDeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState('');

    const fetchDeal = async () => {
        try {
            const res = await api.get(`/deals/${id}`);
            setDeal(res.data.data);
        } catch (err) {
            toast.error('Failed to load deal details');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeal();
    }, [id]);

    const handleAction = async (action, endpoint, payload = {}) => {
        setActionLoading(action);
        try {
            const res = await api.post(`/deals/${deal._id}/${endpoint}`, payload);

            // If it's create-escrow, redirect to mock payment or handle differently
            if (endpoint === 'create-escrow' && res.data.paymentUrl) {
                window.location.href = res.data.paymentUrl;
                return;
            }

            toast.success(`${action} successful`);
            fetchDeal(); // Refresh state
        } catch (err) {
            toast.error(err.response?.data?.error || `Failed to ${action}`);
        } finally {
            setActionLoading('');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'created': return <span className="badge badge-green">Available</span>;
            case 'awaiting_payment': return <span className="badge badge-yellow">Awaiting Escrow Payment</span>;
            case 'in_escrow': return <span className="badge badge-blue">Funds in Escrow</span>;
            case 'meetup_scheduled': return <span className="badge badge-blue">Meetup Scheduled</span>;
            case 'awaiting_buyer_confirmation': return <span className="badge badge-yellow">Awaiting Buyer Confirmation</span>;
            case 'completed': return <span className="badge badge-green">Completed</span>;
            case 'cancelled': return <span className="badge badge-gray">Cancelled</span>;
            case 'disputed': return <span className="badge badge-red">Disputed</span>;
            default: return <span className="badge badge-gray">{status}</span>;
        }
    };

    if (loading) return <div className="container text-center py-8">Loading deal...</div>;
    if (!deal) return null;

    const isSeller = user._id === deal.seller._id;
    const isBuyer = deal.buyer && user._id === deal.buyer._id;
    const isUnassignedBuyer = !deal.buyer && user.role !== 'seller' && !isSeller;

    return (
        <div className="container py-8">
            <div className="card mb-8">
                <div className="flex justify-between items-center mb-4 border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
                    <div>
                        <span className="text-secondary text-sm font-bold uppercase">{deal.category}</span>
                        <h1 className="text-3xl mt-1">{deal.title}</h1>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>
                            {deal.price.toLocaleString('en-IN', { style: 'currency', currency: deal.currency })}
                        </div>
                        <div className="mt-2">{getStatusBadge(deal.status)}</div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">Description</h3>
                    <p className="text-secondary whitespace-pre-wrap">{deal.description}</p>
                </div>

                <div className="dashboard-grid mb-6">
                    <div className="p-4" style={{ backgroundColor: 'var(--bg-color)', borderRadius: '8px' }}>
                        <h4 className="text-sm font-bold text-secondary mb-1">Seller</h4>
                        <p>{deal.seller.name}</p>
                    </div>
                    <div className="p-4" style={{ backgroundColor: 'var(--bg-color)', borderRadius: '8px' }}>
                        <h4 className="text-sm font-bold text-secondary mb-1">Buyer</h4>
                        <p>{deal.buyer ? deal.buyer.name : 'Not assigned yet'}</p>
                    </div>
                    <div className="p-4" style={{ backgroundColor: 'var(--bg-color)', borderRadius: '8px' }}>
                        <h4 className="text-sm font-bold text-secondary mb-1">Location</h4>
                        <p>{deal.city}</p>
                    </div>
                </div>

                {/* Action Panel */}
                <div className="p-6" style={{ backgroundColor: 'var(--bg-color-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Shield size={24} /> Actions Required
                    </h3>

                    {deal.status === 'created' && (
                        <div>
                            {isUnassignedBuyer ? (
                                <>
                                    <p className="mb-4">You are about to express interest and commit to this deal. You will be assigned as the buyer.</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleAction('Assign Buyer', 'assign-buyer')}
                                        disabled={actionLoading !== ''}
                                    >
                                        <Handshake size={18} /> Accept Deal & Proceed
                                    </button>
                                </>
                            ) : isSeller ? (
                                <p className="text-secondary flex items-center gap-2"><AlertCircle size={18} /> Waiting for a buyer to accept the deal.</p>
                            ) : (
                                <p className="text-secondary flex items-center gap-2"><AlertCircle size={18} /> Sellers cannot buy their own deal.</p>
                            )}
                        </div>
                    )}

                    {deal.status === 'awaiting_payment' && (
                        <div>
                            {isBuyer ? (
                                <>
                                    <p className="mb-4">Please deposit funds into the secure escrow account to lock the deal.</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleAction('Initiate Escrow', 'create-escrow')}
                                        disabled={actionLoading !== ''}
                                    >
                                        <Shield size={18} /> Pay to Escrow securely
                                    </button>
                                </>
                            ) : isSeller ? (
                                <p className="text-secondary flex items-center gap-2"><AlertCircle size={18} /> Waiting for {deal.buyer.name} to complete escrow payment.</p>
                            ) : null}
                        </div>
                    )}

                    {deal.status === 'in_escrow' && (
                        <div>
                            <div className="mb-4 p-4 flex gap-3 text-sm" style={{ backgroundColor: 'rgba(56, 139, 253, 0.1)', border: '1px solid rgba(56, 139, 253, 0.4)', borderRadius: '6px', color: '#79c0ff' }}>
                                <CheckCircle size={20} />
                                <div>Funds are securely held in escrow. Please arrange meetup and hand over the item.</div>
                            </div>
                            {isSeller ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleAction('Mark Handed Over', 'mark-handed-over')}
                                    disabled={actionLoading !== ''}
                                >
                                    <Handshake size={18} /> I have handed over the item
                                </button>
                            ) : isBuyer ? (
                                <p className="text-secondary pt-2 flex items-center gap-2"><AlertCircle size={18} /> Waiting for seller to physically hand over the item.</p>
                            ) : null}
                        </div>
                    )}

                    {deal.status === 'awaiting_buyer_confirmation' && (
                        <div>
                            <div className="mb-4 p-4 flex gap-3 text-sm" style={{ backgroundColor: 'rgba(210, 153, 34, 0.1)', border: '1px solid rgba(210, 153, 34, 0.4)', borderRadius: '6px', color: '#e3b341' }}>
                                <AlertCircle size={20} />
                                <div>Seller marked item as handed over. Buyer must confirm satisfaction to release funds.</div>
                            </div>
                            {isBuyer ? (
                                <div className="flex gap-4">
                                    <button
                                        className="btn btn-primary"
                                        style={{ backgroundColor: '#2ea043' }}
                                        onClick={() => handleAction('Confirm Receipt', 'buyer-confirm')}
                                        disabled={actionLoading !== ''}
                                    >
                                        <CheckCircle size={18} /> Confirm & Release Funds
                                    </button>
                                    <button className="btn btn-danger">
                                        Raise Dispute
                                    </button>
                                </div>
                            ) : isSeller ? (
                                <p className="text-secondary pt-2 flex items-center gap-2"><AlertCircle size={18} /> Waiting for buyer to confirm they are satisfied to receive funds.</p>
                            ) : null}
                        </div>
                    )}

                    {deal.status === 'completed' && (
                        <div className="p-4 flex flex-col items-center justify-center gap-2 text-center" style={{ backgroundColor: 'rgba(46, 160, 67, 0.1)', border: '1px solid rgba(46, 160, 67, 0.4)', borderRadius: '6px', color: '#3fb950' }}>
                            <CheckCircle size={40} />
                            <h4 className="text-lg font-bold text-white">Transaction Complete</h4>
                            <p>Funds successfully released to seller.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DealDetails;
