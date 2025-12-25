import { useState } from "react";
import { User, Lock } from "lucide-react";
import axios from "axios";

function LoginForm({ switchToRegister, onLoginSuccess }) {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const identifier = e.target[0].value.trim(); // username/email/phone
        const password = e.target[1].value.trim();

        if (!identifier || !password) {
            setErrorMessage("❌ Please fill all fields");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post("http://localhost:8789/login", {
                identifier,
                password
            });

            // ✅ Save user in localStorage
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // ✅ Login success
            onLoginSuccess(res.data.user);
        } catch (err) {
            setErrorMessage(
                "❌ " + (err.response?.data?.error || "Invalid credentials")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full max-w-[900px] bg-[#0f1221] rounded-md overflow-hidden shadow-lg">
            {/* Left side: Form */}
            <div className="w-1/2 p-8 flex flex-col justify-center gap-6">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>

                {errorMessage && (
                    <div className="text-center mb-2 p-2 rounded-md bg-red-700/30 text-red-300 font-medium">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="relative border-b-2 border-white/80 pb-1">
                        <input
                            type="text"
                            placeholder="Email / Phone"
                            className="bg-transparent w-full text-white outline-none placeholder:text-white/80 py-2"
                        />
                        <User className="absolute right-0 bottom-2 text-white w-5 h-5" />
                    </div>

                    <div className="relative border-b-2 border-white/80 pb-1">
                        <input
                            type="password"
                            placeholder="Password"
                            className="bg-transparent w-full text-white outline-none placeholder:text-white/80 py-2"
                        />
                        <Lock className="absolute right-0 bottom-2 text-white w-5 h-5" />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full py-2 border-2 border-red-600 rounded-full text-white font-bold hover:bg-red-600/20 transition-all text-lg mt-4"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-white text-sm mb-2">Don't have an account?</p>
                    <button
                        onClick={switchToRegister}
                        className="text-red-600 font-bold hover:underline"
                    >
                        Sign Up
                    </button>
                </div>
            </div>

            {/* Right side: Red Diagonal */}
            <div className="w-1/2 bg-[#8b0000] relative flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-[#0f1221]"
                    style={{ clipPath: "polygon(0 0, 0% 200%, 100% 700%)" }}
                ></div>
            </div>
        </div>
    );
}

export default LoginForm;
