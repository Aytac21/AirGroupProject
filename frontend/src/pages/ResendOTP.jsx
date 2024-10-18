import React, { useState } from 'react';
import axios from 'axios';

const ResendOTP = ({ email }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleResend = async () => {
        setLoading(true);
        try {
            await axios.post('http://127.0.0.1:8080/users/resend-otp/', { email });
            setMessage('OTP has been resent to your email.');
        } catch (error) {
            setMessage('Error resending OTP. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div>
            <button
                onClick={handleResend}
                className="text-blue-600 hover:underline"
                disabled={loading}
            >
                {loading ? 'Resending...' : 'Resend OTP'}
            </button>
            {message && <p className="text-sm text-green-600">{message}</p>}
        </div>
    );
};

export default ResendOTP;
