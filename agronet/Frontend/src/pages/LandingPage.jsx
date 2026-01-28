import { Link } from 'react-router-dom';
import { ROUTES } from '../routing/routes';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-bold mb-6 text-green-800">AgroNet Navigation</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm w-full max-w-sm space-y-4 flex flex-col">
                <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline">Login Page</Link>
                <Link to={ROUTES.REGISTER} className="text-blue-600 hover:underline">Register Page</Link>
                <hr className="border-gray-100" />
                <Link to={ROUTES.HOME} className="text-gray-600 hover:text-green-700">Home (Protected)</Link>
                <Link to={ROUTES.RENTALS} className="text-gray-600 hover:text-green-700">Rentals (Protected)</Link>
                <Link to={ROUTES.MAPS} className="text-gray-600 hover:text-green-700">Maps (Protected)</Link>
                <Link to={ROUTES.SCHEMES} className="text-gray-600 hover:text-green-700">Schemes (Protected)</Link>
            </div>
        </div>
    );
};

export default LandingPage;
