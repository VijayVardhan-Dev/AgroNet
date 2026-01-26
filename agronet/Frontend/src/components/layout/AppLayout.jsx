import { Link } from "react-router-dom";
import { ROUTES } from "../../routing/routes";

const AppLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white shadow p-4 mb-4 flex gap-4">
                <Link to={ROUTES.HOME} className="text-blue-600 hover:underline">Home</Link>
                <Link to={ROUTES.RENTALS} className="text-blue-600 hover:underline">Rentals</Link>
                <Link to={ROUTES.MAPS} className="text-blue-600 hover:underline">Maps</Link>
                <Link to={ROUTES.SCHEMES} className="text-blue-600 hover:underline">Schemes</Link>
                <Link to={ROUTES.PROFILE} className="text-blue-600 hover:underline">Profile</Link>
                <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline ml-auto">Login</Link>
            </nav>
            <main className="p-4 flex-grow">
                {children}
            </main>
        </div>
    );
};

export default AppLayout;