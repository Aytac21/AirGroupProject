import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:8080/users/password-reset/', { email });
            const { email: responseEmail } = response.data;

            setOtpSent(true);
            setMessage('Reset link has been sent to your email. You can now verify your OTP.');
        } catch (error) {
            setMessage('Error sending reset link. Please try again.');
        }
        setLoading(false);
    };

    const handleResendOTP = async () => {
        setLoading(true);
        try {
            await axios.post('http://127.0.0.1:8080/users/resend-otp/', { email });
            setMessage('OTP has been resent to your email.');
            navigate('/verify-otp', { state: { email } });
        } catch (error) {
            setMessage('Error resending OTP. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-96 justify-center items-center bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded">
                <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">E-Mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="example@domain.com"
                        />
                    </div>
                    {message && <p className="text-sm text-green-600 mb-4">{message}</p>}
                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                {otpSent && (
                    <div className="mt-4">
                        <button
                            onClick={handleResendOTP}
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? 'Resending...' : 'Resend OTP'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PasswordResetRequest;
