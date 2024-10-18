import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { useSelector } from 'react-redux';

function UsersTable() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUserId, setEditingUserId] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({});
    const [loading, setLoading] = useState(true);

    const { isLoggedIn } = useSelector(state => state.auth);

    useEffect(() => {
        if (isLoggedIn) {
            fetchUsers();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');
            const response = await axios.get('http://127.0.0.1:8080/users/users/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user) => {
        setEditingUserId(user.id);
        setUpdatedUser({ ...user });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.put(`http://127.0.0.1:8080/users/update_user/${editingUserId}/`, updatedUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEditingUserId(null);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteClick = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const token = localStorage.getItem('access_token');
                await axios.delete(`http://127.0.0.1:8080/users/delete_user/${userId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const filteredUsers = users.filter((user) => {
        return `${user.first_name} ${user.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
    });

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold mb-6">Users</h2>
            {loading ? (
                <p>Loading users...</p>
            ) : !isLoggedIn ? (
                <p>Please log in to see the users.</p>
            ) : (
                <>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search"
                            className="border border-gray-300 rounded-md p-2 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow">
                            <thead className="bg-blue-900 text-white">
                                <tr>
                                    <th className="p-4 text-left">ID</th>
                                    <th className="p-4 text-left">First name</th>
                                    <th className="p-4 text-left">Last name</th>
                                    <th className="p-4 text-left">Username</th>
                                    <th className="p-4 text-left">Phone</th>
                                    <th className="p-4 text-left">Email</th>
                                    <th className="p-4 text-left">Edit</th>
                                    <th className="p-4 text-left">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <tr key={user.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                        <td className="p-4">{`#${(index + 1).toString().padStart(4, '0')}`}</td>
                                        <td className="p-4">
                                            {editingUserId === user.id ? (
                                                <input
                                                    type="text"
                                                    name="first_name"
                                                    value={updatedUser.first_name || ''}
                                                    onChange={handleInputChange}
                                                    className="border rounded-md p-1 max-w-28"
                                                />
                                            ) : (
                                                user.first_name
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {editingUserId === user.id ? (
                                                <input
                                                    type="text"
                                                    name="last_name"
                                                    value={updatedUser.last_name || ''}
                                                    onChange={handleInputChange}
                                                    className="border rounded-md p-1 max-w-28"
                                                />
                                            ) : (
                                                user.last_name
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {editingUserId === user.id ? (
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={updatedUser.username || ''}
                                                    onChange={handleInputChange}
                                                    className="border rounded-md p-1 max-w-28"
                                                />
                                            ) : (
                                                user.username
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {editingUserId === user.id ? (
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    value={updatedUser.phone || ''}
                                                    onChange={handleInputChange}
                                                    className="border rounded-md p-1 max-w-28"
                                                />
                                            ) : (
                                                user.phone
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {editingUserId === user.id ? (
                                                <input
                                                    type="text"
                                                    name="email"
                                                    value={updatedUser.email || ''}
                                                    onChange={handleInputChange}
                                                    className="border rounded-md p-1 max-w-48"
                                                />
                                            ) : (
                                                user.email
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {editingUserId === user.id ? (
                                                <button onClick={handleUpdate} className="text-blue-500">Save</button>
                                            ) : (
                                                <FaEdit onClick={() => handleEditClick(user)} className="cursor-pointer" />
                                            )}
                                        </td>
                                        <td className="p-4 mx-auto">
                                            <FaDeleteLeft
                                                onClick={() => handleDeleteClick(user.id)}
                                                className="cursor-pointer text-red-500 mx-auto"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default UsersTable;
