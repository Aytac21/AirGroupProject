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
    const { message } = useSelector(state => state.message); 

    const dispatch = useDispatch();

    const onChangeEmail = (e) => setEmail(e.target.value);
    const onChangePassword = (e) => setPassword(e.target.value);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        console.log("Attempting to log in with:", email, password);

        if (email && password) {
            const headers = {
                'Content-Type': 'application/json',
            };

            dispatch(login(email, password, headers))
                .then(() => {
                    console.log("Login successful"); 
                    navigate("/");
                })
                .catch((error) => {
                    console.error("Login failed:", error); 
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
                                Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Sign Up</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
