import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/auth';

function Navbar() {
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="bg-blue-900 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold">AirGroup</div>
                <div className="space-x-4 flex items-center">
                    <a href="/" className="hover:text-gray-300">Users</a>
                    {isLoggedIn ? (
                        <a href="#" className="hover:text-gray-300" onClick={handleLogout}>Log out</a>
                    ) : (
                        <>
                            <a href="/login" className="hover:text-gray-300">Log in</a>
                            <a href="/register" className="hover:text-gray-300">Sign up</a>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
