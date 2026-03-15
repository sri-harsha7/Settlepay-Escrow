import { Link } from 'react-router-dom';
import { Shield, CreditCard, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div>
            <section className="hero">
                <div className="container">
                    <h1>Secure peer-to-peer deals.</h1>
                    <p>Buy and sell used electronics and goods safely. We hold the funds in escrow until both parties are satisfied.</p>
                    {user ? (
                        <Link to="/dashboard" className="btn btn-primary text-xl" style={{ padding: '0.75rem 2rem' }}>
                            Go to Dashboard <ArrowRight size={20} />
                        </Link>
                    ) : (
                        <Link to="/signup" className="btn btn-primary text-xl" style={{ padding: '0.75rem 2rem' }}>
                            Start your first Settlepay <ArrowRight size={20} />
                        </Link>
                    )}
                </div>
            </section>

            <section className="container" style={{ padding: '4rem 1rem' }}>
                <h2 className="text-center text-3xl mb-4 font-bold">How it Works</h2>
                <div className="dashboard-grid mt-4">
                    <div className="card text-center flex-col items-center">
                        <div className="mb-2" style={{ color: 'var(--accent-color)' }}><Shield size={48} /></div>
                        <h3 className="text-xl">1. Create Deal</h3>
                        <p className="text-secondary text-sm">Seller lists an item and buyer agrees to purchase.</p>
                    </div>
                    <div className="card text-center flex-col items-center">
                        <div className="mb-2" style={{ color: '#58a6ff' }}><CreditCard size={48} /></div>
                        <h3 className="text-xl">2. Escrow Payment</h3>
                        <p className="text-secondary text-sm">Buyer pays into a secure escrow account.</p>
                    </div>
                    <div className="card text-center flex-col items-center">
                        <div className="mb-2" style={{ color: '#3fb950' }}><CheckCircle size={48} /></div>
                        <h3 className="text-xl">3. Meet & Confirm</h3>
                        <p className="text-secondary text-sm">Inspect the item in person and release funds on satisfaction.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
