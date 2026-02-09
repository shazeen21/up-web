import Link from "next/link";

export default function AuthCodeError() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
            <p className="mb-6 text-gray-700">
                There was an error verifying your login. The link may have expired or is invalid.
            </p>
            <Link
                href="/"
                className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 transition"
            >
                Return to Home
            </Link>
        </div>
    );
}
