import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login, googleSignIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError("");
            setLoading(true);
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError("Failed to sign in. " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setError("");
            setLoading(true);
            await googleSignIn();
            navigate("/");
        } catch (err) {
            setError("Failed to sign in with Google. " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{" "}
                        <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
                            start your free trial
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-gray-50 px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                        >
                            <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                <path
                                    d="M12.0003 20.45c4.6667 0 8.0834-3.21 8.0834-8.0833 0-0.6267-0.0567-1.2267-0.1667-1.8034H12.0003v3.4167h4.6334c-0.2 1.0767-1.1234 2.87-4.6334 2.87-2.79 0-5.0667-2.3167-5.0667-5.1767s2.2767-5.1766 5.0667-5.1766c1.5833 0 3.0167 0.58 4.12 1.6333l2.55-2.55C17.0669 4.1167 14.7369 3.25 12.0003 3.25 7.1669 3.25 3.2503 7.1667 3.2503 12s3.9166 8.75 8.75 8.75z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M23.49 12.275c0-0.71-0.07-1.42-0.18-2.11H12v4.06h6.47c-0.29 1.48-1.13 2.73-2.4 3.56v3h3.86c2.26-2.09 3.56-5.17 3.56-8.51z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M5.26498 14.2949C5.02498 13.5649 4.88498 12.7949 4.88498 11.9949C4.88498 11.1949 5.01498 10.4249 5.26498 9.69492L1.40498 6.69492C0.62498 8.24492 0.17498 9.99492 0.17498 11.9949C0.17498 13.9949 0.61498 15.7449 1.40498 17.2949L5.26498 14.2949Z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12.0004 5.38501C14.1304 5.38501 16.0304 6.11501 17.5304 7.54501L20.6504 4.42501C18.4204 2.34501 15.4104 1.05501 12.0004 1.05501C8.24039 1.05501 4.93039 3.21501 3.28039 6.51501L7.14039 9.51501C8.05039 6.43501 10.9904 5.38501 12.0004 5.38501Z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span className="text-sm font-semibold leading-6">Google</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;