function Footer() {
    return (
        <footer className="bg-blue-100 py-8">
            <div className="container mx-auto flex justify-between text-sm">
                <div className="space-y-2">
                    <h3 className="font-bold">Passengers</h3>
                    <a href="#" className="block text-gray-600 hover:text-gray-800">Flights</a>
                    <a href="#" className="block text-gray-600 hover:text-gray-800">Airlines</a>
                    <a href="#" className="block text-gray-600 hover:text-gray-800">Park</a>
                    <a href="#" className="block text-gray-600 hover:text-gray-800">Security Wait Times</a>
                    <a href="#" className="block text-gray-600 hover:text-gray-800">Map</a>
                    <a href="#" className="block text-gray-600 hover:text-gray-800">Shop & Dine</a>
                </div>
                <div className="space-y-2">
                    <h3 className="font-bold">Business and Community</h3>
                    <a href="#" className="block text-gray-600 hover:text-gray-800">About us</a>
                    <a href="#" className="block text-gray-600 hover:text-gray-800">Career</a>
                </div>
                <div className="space-y-2">
                    <h3 className="font-bold">General</h3>
                    <a href="#" className="block text-gray-600 hover:text-gray-800">Report Property</a>
                    <a href="#" className="block text-gray-600 hover:text-gray-800">Sign Up</a>
                    <a href="#" className="block text-gray-600 hover:text-gray-800">Contact us</a>
                    <a href="#" className="block text-gray-600 hover:text-gray-800">Newsroom</a>
                </div>

            </div>
            <div className="mt-8 text-center">
                <a href="#" className="bg-blue-700 text-white py-2 px-4 rounded-full inline-block hover:bg-blue-800">
                    Go to top ↑
                </a>
            </div>
        </footer>
    );
}

export default Footer;
