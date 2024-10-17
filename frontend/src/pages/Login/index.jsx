import upload from "../../assets/image 1.png";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from 'react-router-dom';
import { login } from "../../actions/auth";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const LoginPage = (props) => {
    let navigate = useNavigate();
    const form = useRef();
    const checkBtn = useRef();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { isLoggedIn } = useSelector(state => state.auth);
    const { message } = useSelector(state => state.message); // Mesajı alın

    const dispatch = useDispatch();

    const onChangeEmail = (e) => setEmail(e.target.value);
    const onChangePassword = (e) => setPassword(e.target.value);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        if (email && password) {
            dispatch(login(email, password))
                .then(() => {
                    navigate("/");
                    window.location.reload();
                })
                .catch(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    };



    if (isLoggedIn) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
                <div className="text-2xl font-semibold">Utravel</div>
                <div className="space-x-6">
                    <a href="#" className="hover:underline">Home</a>
                    <a href="#" className="hover:underline">Help</a>
                    <a href="#" className="hover:underline">Log in</a>
                    <a href="#" className="hover:underline">Sign up</a>
                </div>
            </nav>

            <div className="flex flex-1 bg-gray-100">
                <div className="hidden md:flex md:w-1/2 lg:w-3/5">
                    <img src={upload} alt="Mountains" className="object-cover w-full h-full" />
                </div>

                <div className="flex w-full md:w-1/2 lg:w-2/5 justify-center items-center p-8 bg-yellow-50">
                    <div className="w-full max-w-md">
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">Welcome back</h2>
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Login to your account</h3>

                        {/* Xəbərdarlıq mesajını burada göstərin */}
                        {message && (
                            <div className="alert alert-danger mb-4" role="alert">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleLogin} ref={form}>
                            <div className="mb-4">
                                <label className="block text-gray-700">E-Mail</label>
                                {required(email)} {/* E-mail sahəsi üçün tələb */}
                                <input
                                    type="email"
                                    placeholder="example@domain.com"
                                    className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    value={email}
                                    onChange={onChangeEmail}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Password</label>
                                {required(password)} {/* Şifrə sahəsi üçün tələb */}
                                <input
                                    type="password"
                                    placeholder="********"
                                    className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    value={password}
                                    onChange={onChangePassword}
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300"
                            >
                                Login now
                            </button>

                            <p className="mt-6 text-center">
                                Don't have an account? <a href="#" className="text-blue-600 hover:underline">Sign Up</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h5 className="font-bold">Passengers</h5>
                        <ul className="space-y-2">
                            <li>Flights</li>
                            <li>Airlines</li>
                            <li>Hotels</li>
                            <li>Map</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold">Business and Community</h5>
                        <ul className="space-y-2">
                            <li>About us</li>
                            <li>Careers</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold">General</h5>
                        <ul className="space-y-2">
                            <li>Report Property</li>
                            <li>Sign Up</li>
                            <li>Contact Us</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm">© 2024 Utravel. All rights reserved.</p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400">Privacy Policy</a>
                        <a href="#" className="text-gray-400">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LoginPage;
