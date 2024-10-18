import { useState } from 'react';
import upload from "../assets/image 1.png";
import { useDispatch } from 'react-redux';
import { register } from '../actions/auth';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        username: '',
        password: '',
        password2: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { email, first_name, last_name, phone, username, password, password2 } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();

        dispatch(register(username, email, password, password2, first_name, last_name, phone))
            .then(() => {
                navigate('/login');
            })
            .catch((error) => {
                console.error("Registration failed", error);
            });
    };

    return (
        <div className="flex min-h-screen bg-blue-900">
            <div className="w-1/2 bg-cover" style={{ backgroundImage: `url(${upload})` }}></div>
            <div className="w-1/2 flex items-center justify-center bg-yellow-50">
                <div className="max-w-md w-full space-y-4 p-8">
                    <h2 className="text-xl font-semibold">Welcome to Utravel</h2>
                    <h1 className="text-2xl font-bold">Create account</h1>
                    <form className="space-y-4" onSubmit={onSubmit}>
                        <div className="flex space-x-4">
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First name"
                                value={first_name}
                                onChange={onChange}
                                className="border border-gray-300 p-2 rounded w-1/2"
                            />
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last name"
                                value={last_name}
                                onChange={onChange}
                                className="border border-gray-300 p-2 rounded w-1/2"
                            />
                        </div>
                        <div className="flex space-x-4">
                            <input
                                type="email"
                                name="email"
                                placeholder="your.email@mail.com"
                                value={email}
                                onChange={onChange}
                                className="border border-gray-300 p-2 rounded w-1/2"
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                value={phone}
                                onChange={onChange}
                                className="border border-gray-300 p-2 rounded w-1/2"
                            />
                        </div>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={username}
                            onChange={onChange}
                            className="border border-gray-300 p-2 rounded w-full"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={onChange}
                            className="border border-gray-300 p-2 rounded w-full"
                        />
                        <input
                            type="password"
                            name="password2"
                            placeholder="Confirm password"
                            value={password2}
                            onChange={onChange}
                            className="border border-gray-300 p-2 rounded w-full"
                        />
                        <button
                            type="submit"
                            className="w-full bg-orange-400 text-white p-2 rounded"
                        >
                            Create account
                        </button>
                    </form>
                    <p className="text-center">
                        Already have an account? <a href="/login" className="text-blue-600">Log In</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
