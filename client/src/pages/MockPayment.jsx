import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Shield, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const MockPayment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing'); // processing, success, error

    useEffect(() => {
        // Simulate payment process
        const timer = setTimeout(() => {
            setStatus('success');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const handleReturn = async () => {
        try {
            // Simulate the webhook that the provider would send to our backend
            await api.post('/mock/payment-success', {
                providerTransactionId: `mock_t_id_${Date.now()}` // This would normally match
            });
            toast.success('Escrow Payment Successful!');
            navigate(`/deals/${id}`);
        } catch (err) {
            toast.error('Payment Error Simulation');
        }
    };

    return (
        <div className="container flex justify-center items-center" style={{ minHeight: '100vh', background: 'var(--bg-color-secondary)' }}>
            <div className="card text-center flex-col items-center" style={{ width: '100%', maxWidth: '400px' }}>
                <Shield size={48} color={status === 'success' ? '#3fb950' : 'var(--accent-color)'} className="mb-4" />
                <h2 className="text-2xl mb-2">Mock Escrow Provider</h2>

                {status === 'processing' ? (
                    <div>
                        <p className="text-secondary mb-4">Processing your secure payment...</p>
                        <div className="flex justify-center"><Loader className="spinner" /></div>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm mb-4" style={{ color: '#3fb950' }}>Payment Captured Successfully.</p>
                        <button className="btn btn-primary" onClick={handleReturn} style={{ width: '100%' }}>
                            Return to Settlepay
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MockPayment;
