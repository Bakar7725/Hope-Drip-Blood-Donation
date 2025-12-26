import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react"; // Add Eye and EyeOff icons
import axios from "axios";
import { UserLock } from "lucide-react";
import { Activity } from 'lucide-react';
import { Syringe } from 'lucide-react';
import { HandHeart } from 'lucide-react';

function LoginForm({ switchToRegister, onLoginSuccess }) {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Add state for password visibility

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const identifier = e.target[0].value.trim();
        const password = e.target[1].value.trim();

        if (!identifier || !password) {
            setErrorMessage("❌ Please fill all fields");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post("http://localhost:8789/login", {
                identifier,
                password,
            });

            localStorage.setItem("user", JSON.stringify(res.data.user));
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
        <div className="flex w-full max-w-[900px] bg-[#0f1221] rounded-md overflow-hidden shadow-2xl">

            {/* LEFT: LOGIN FORM */}
            <div className="w-1/2 p-8 flex flex-col justify-center gap-6">
                <h2 className="text-3xl font-bold text-white text-center mb-6">
                    Login
                </h2>

                {errorMessage && (
                    <div className="text-center p-2 rounded-md bg-red-700/30 text-red-300 font-medium">
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

                    {/* Password field with eye icon */}
                    <div className="relative border-b-2 border-white/80 pb-1">
                        <input
                            type={showPassword ? "text" : "password"} // Toggle type
                            placeholder="Password"
                            className="bg-transparent w-full text-white outline-none placeholder:text-white/80 py-2 pr-10"
                        />
                        {/* Eye toggle button */}
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-8 bottom-2 text-white hover:text-gray-300"
                        >
                            {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
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
                    <p className="text-white text-sm mb-2">
                        Don't have an account?
                    </p>
                    <button
                        onClick={switchToRegister}
                        className="text-red-600 font-bold hover:underline"
                    >
                        Sign Up
                    </button>
                </div>
            </div>

            {/* RIGHT: PURPOSE / BRAND PANEL */}
            {/* Right side: Red Diagonal (UNCHANGED GEOMETRY) */}
            <div className="w-1/2 bg-[#8b0000] relative flex items-center justify-center">

                {/* Existing diagonal overlay — SAME AS BEFORE */}
                <div
                    className="absolute inset-0 bg-[#0f1221]"
                    style={{ clipPath: "polygon(0 0, 0% 200%, 100% 700%)" }}
                />

                {/* Content added WITHOUT touching layout */}
                <div className="relative z-10 text-center px-10 text-white max-w-sm">
                    <UserLock className="mx-auto mb-4 w-12 h-12 text-white" />

                    <h2 className="text-2xl font-bold mb-3">
                        Save Lives
                    </h2>

                    <p className="text-sm text-white/80 leading-relaxed">
                        One donation can save up to three lives.
                        Hope Drip connects donors with patients
                        when every second matters.
                    </p>

                </div>

                <div className="absolute bottom-4 right-50 text-white align-items-horizontal flex gap-2">
                    <Activity className="w-6 h-6 mt-2 animate-spin-slow text-white" />
                    <Syringe className="w-6 h-6 mt-2 text-white" />
                    <HandHeart className="w-6 h-6 mt-2 text-white" />
                </div>
            </div>

        </div>
    );
}

export default LoginForm;