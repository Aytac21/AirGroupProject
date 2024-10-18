import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PasswordResetConfirm = () => {
    const { uidb64, token } = useParams();
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (password !== password2) {
            setMessage('Passwords do not match.');
            setLoading(false);
            return;
        }
        try {
            await axios.post(`http://127.0.0.1:8080/users/password-reset-confirm/${uidb64}/${token}/`, {
                password,
            });
            setMessage('Password has been reset successfully!');
            navigate('/login');
        } catch (error) {
            setMessage('Error resetting password. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col min-h-screen justify-center items-center bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded">
                <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>
                <form onSubmit={handleReset}>
                    <div className="mb-4">
                        <label className="block text-gray-700">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                            className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Confirm new password"
                        />
                    </div>
                    {message && <p className="text-sm text-red-600 mb-4">{message}</p>}
                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300"
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordResetConfirm;
