import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const CreateDeal = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'smartphone',
        city: '',
        price: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                price: Number(formData.price)
            };
            const res = await api.post('/deals', payload);
            toast.success('Deal created successfully!');
            navigate(`/deals/${res.data.data._id}`);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to create deal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container flex justify-center" style={{ padding: '2rem 0' }}>
            <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                <h2 className="text-2xl font-bold mb-4">Create New Deal</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title (e.g., Used iPhone 13 128GB)</label>
                        <input
                            name="title"
                            type="text"
                            className="form-input"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group flex justify-between gap-4">
                        <div style={{ flex: 1 }}>
                            <label className="form-label">Category</label>
                            <select name="category" className="form-select" onChange={handleChange} value={formData.category}>
                                <option value="smartphone">Smartphone</option>
                                <option value="laptop">Laptop / PC</option>
                                <option value="camera">Camera</option>
                                <option value="console">Gaming Console</option>
                                <option value="other">Other Electronics</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="form-label">City</label>
                            <input
                                name="city"
                                type="text"
                                className="form-input"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Price (INR)</label>
                        <input
                            name="price"
                            type="number"
                            min="1"
                            className="form-input"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label">Description / Condition Info</label>
                        <textarea
                            name="description"
                            className="form-textarea"
                            rows="4"
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Publishing...' : 'Publish Deal'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateDeal;
