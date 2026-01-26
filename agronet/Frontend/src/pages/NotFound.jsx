
import { ROUTES } from "../routing/routes";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-6xl font-bold text-gray-200">404</h1>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h2>
            <p className="mt-2 text-gray-500 max-w-sm">
                Sorry, we couldn't find the page you're looking for.
            </p>
            <Link to={ROUTES.HOME} className="mt-8">
                <Button>Go back home</Button>
            </Link>
        </div>
    );
};

export default NotFound;
