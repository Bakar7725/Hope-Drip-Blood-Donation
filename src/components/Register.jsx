import { useState } from "react";
import { User, Lock, Mail } from "lucide-react";
import OTPVerification from "./OTPVerification";
import axios from "axios";

function RegisterForm({ switchToLogin }) {
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [otpEmail, setOtpEmail] = useState("");
    const [otpUserData, setOtpUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [registrationCompleted, setRegistrationCompleted] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setRegistrationCompleted(false);

        const { username, email, password } = formData;

        if (!username || !email || !password) {
            setErrorMessage("❌ Please fill all fields");
            return;
        }

        setLoading(true);

        // Remove cnic from userData
        const userData = {
            username,
            email,
            password,

        };

        try {
            // Remove cnic from check request
            const checkRes = await axios.post("http://localhost:8789/check-user-exists", {
                email: email,
                username: username,
                phone: userData.phone  // Keep phone
                // Remove cnic: userData.cnic
            });

            if (checkRes.data.exists) {
                let msg = "❌ ";
                if (checkRes.data.emailExists) msg += "Email already exists. ";
                if (checkRes.data.usernameExists) msg += "Username already exists. ";
                if (checkRes.data.phoneExists) msg += "Phone already exists. ";
                setErrorMessage(msg);
                setLoading(false);
                return;
            }

            const otpRes = await axios.post("http://localhost:8789/send-otp", {
                email,
                userData
            });

            if (otpRes.data.success) {
                setOtpEmail(email);
                setOtpUserData(userData);
                setOtpModalOpen(true);
                setSuccessMessage("✅ OTP sent to your email! Check inbox.");
            }
        } catch (err) {
            setErrorMessage("❌ " + (err.response?.data?.message || "Registration failed"));
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = (verifiedUser) => {
        setOtpModalOpen(false);
        setErrorMessage("");
        setSuccessMessage("");
        setRegistrationCompleted(true);
    };

    const handleResend = async () => {
        try {
            const res = await axios.post("http://localhost:8789/resend-otp", {
                email: otpEmail,
                userData: otpUserData
            });
            if (res.data.success) {
                alert("✅ OTP resent successfully!");
            }
        } catch (err) {
            alert("❌ Failed to resend OTP");
        }
    };

    if (registrationCompleted) {
        return (
            <div className="flex w-full max-w-[900px] bg-[#0f1221] rounded-md overflow-hidden shadow-lg">
                <div className="w-1/2 p-8 flex flex-col justify-center gap-6">
                    <h2 className="text-3xl font-bold text-white text-center mb-4">Basic Registration Complete!</h2>

                    <div className="text-center mb-4 p-4 rounded-md font-medium bg-yellow-700/30 text-yellow-300">
                        ⚠️ Registration successful but account is not yet verified.
                        <br />
                        <strong>Complete your donor or Patient profile to verify your account and help save lives!</strong>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={switchToLogin}
                            className="w-full py-3 border-2 border-red-600 rounded-full text-white font-bold hover:bg-red-600/20 transition-all text-lg"
                        >
                            Sign In Now
                        </button>

                        <p className="text-white text-center text-sm">
                            Sign in to complete your donor profile and verify your account
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex w-full max-w-[900px] bg-[#0f1221] rounded-md overflow-hidden shadow-lg">
                <div className="w-1/2 relative flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-[#8b0000]"
                        style={{ clipPath: "polygon(0 0, 100% 0, 0 350%)" }}
                    ></div>
                </div>

                <div className="w-1/2 p-8 flex flex-col justify-center gap-6">
                    <h2 className="text-3xl font-bold text-white text-center mb-4">Register</h2>

                    {errorMessage && (
                        <div className={`text-center mb-4 p-2 rounded-md font-medium ${errorMessage.startsWith("✅") ? "bg-green-700/30 text-green-300" : "bg-red-700/30 text-red-300"}`}>
                            {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div className="text-center mb-4 p-2 rounded-md font-medium bg-green-700/30 text-green-300">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="flex flex-col gap-4">
                        <div className="relative border-b-2 border-white/80 pb-1">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleFormChange}
                                className="bg-transparent w-full text-white outline-none placeholder:text-white/80 py-2"
                                required
                            />
                            <User className="absolute right-0 bottom-2 text-white w-5 h-5" />
                        </div>

                        <div className="relative border-b-2 border-white/80 pb-1">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleFormChange}
                                className="bg-transparent w-full text-white outline-none placeholder:text-white/80 py-2"
                                required
                            />
                            <Mail className="absolute right-0 bottom-2 text-white w-5 h-5" />
                        </div>

                        <div className="relative border-b-2 border-white/80 pb-1">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleFormChange}
                                className="bg-transparent w-full text-white outline-none placeholder:text-white/80 py-2"
                                required
                                minLength={6}
                            />
                            <Lock className="absolute right-0 bottom-2 text-white w-5 h-5" />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 border-2 border-red-600 rounded-full text-white font-bold hover:bg-red-600/20 transition-all text-lg mt-4"
                        >
                            {loading ? "Sending OTP..." : "Register & Verify"}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-white text-sm mb-2">Already have an account?</p>
                        <button onClick={switchToLogin} className="text-red-600 font-bold hover:underline">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>

            {otpModalOpen && otpUserData && (
                <OTPVerification
                    email={otpEmail}
                    userData={otpUserData}
                    isOpen={otpModalOpen}
                    onVerify={handleVerify}
                    onResend={handleResend}
                    onClose={() => setOtpModalOpen(false)}
                />
            )}
        </>
    );
}

export default RegisterForm;