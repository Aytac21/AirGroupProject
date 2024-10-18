import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://127.0.0.1:8080/users/verify-otp/', { email, otp });
            setMessage('OTP verified! You can now reset your password.');
            navigate(`/reset-password/${email}`);
        } catch (error) {
            setMessage('Invalid OTP. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col min-h-screen justify-center items-center bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded">
                <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
                <form onSubmit={handleVerify}>
                    <div className="mb-4">
                        <label className="block text-gray-700">OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Enter OTP"
                        />
                    </div>
                    {message && <p className="text-sm text-red-600 mb-4">{message}</p>}
                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300"
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOTP;
