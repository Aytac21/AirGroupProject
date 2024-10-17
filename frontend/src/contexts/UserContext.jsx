import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('access_token');
        const storedRefreshToken = localStorage.getItem('refresh_token');

        const refreshAccessToken = async () => {
            if (storedRefreshToken) {
                try {
                    const response = await fetch('http://127.0.0.1:8080/users/token/refresh/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ refresh: storedRefreshToken }),
                    });

                    const data = await response.json();
                    if (data.access) {
                        localStorage.setItem('access_token', data.access);
                        setAccessToken(data.access);
                        console.log('New access token set in localStorage');
                    } else {
                        console.error('Failed to retrieve new access token:', data);
                    }
                } catch (error) {
                    console.error('Error during token refresh:', error);
                }
            } else {
                console.error('No refresh token found in localStorage');
            }

            setLoading(false);
        };

        refreshAccessToken();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                    <p className="mt-4 text-gray-700 text-lg">Yüklənir, gözləyin zəhmət olmasa...</p>
                </div>
            </div>
        );
    }

    return (
        <UserContext.Provider value={{ accessToken, refreshToken }}>
            {children}
        </UserContext.Provider>
    );
};
