import notFound from "../../assets/images/404.svg";
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-white px-4">
            <div className="flex flex-col items-center text-center max-w-lg">
                <img src={notFound} alt="404 Not Found" className="w-72 mb-6" />
                <h1 className="text-4xl font-bold text-gray-800 mb-3">Page Not Found</h1>
                <p className="text-gray-600 mb-6">
                    Sorry, the page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition hover:text-black"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
