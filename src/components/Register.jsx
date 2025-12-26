import { useState } from "react";
import { User, Lock, Mail, Eye, EyeOff, Activity, Syringe, HandHeart, UserRoundPlus, X, Check } from "lucide-react";
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
    const [showPassword, setShowPassword] = useState(false);

    // Password strength state
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0, // 0: weak, 1: medium, 2: strong
        message: "Password not set",
        color: "gray",
        requirements: {
            length: false,
            lowercase: false,
            uppercase: false,
            number: false,
            special: false
        }
    });

    // Username validation state
    const [usernameValidation, setUsernameValidation] = useState({
        isValid: false,
        message: "",
        checking: false
    });

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    // Username validation rules
    // Username validation rules
    const validateUsername = (username) => {
        const rules = {
            minLength: username.length >= 5,
            maxLength: username.length <= 20,
            startsWithLetter: /^[a-zA-Z]/.test(username),
            allowedChars: /^[a-zA-Z0-9_.-]+$/.test(username),
            hasSpecialChar: /[._-]/.test(username), // NEW RULE: Must contain at least one special character
            noConsecutiveSpecial: !/(\.\.|--|__)/.test(username),
            noReservedWords: !/^(admin|root|moderator|administrator)$/i.test(username)
        };

        const messages = [];
        if (!rules.minLength) messages.push("At least 5 characters");
        if (!rules.maxLength) messages.push("Maximum 20 characters");
        if (!rules.startsWithLetter) messages.push("Must start with a letter");
        if (!rules.allowedChars) messages.push("Only letters, numbers, . _ - allowed");
        if (!rules.hasSpecialChar) messages.push("Must contain at least one special character (._-)");
        if (!rules.noConsecutiveSpecial) messages.push("No consecutive special characters");
        if (!rules.noReservedWords) messages.push("Username not allowed");

        const isValid = Object.values(rules).every(rule => rule === true);

        return {
            isValid,
            message: messages.length > 0 ? messages.join(", ") : "✓ Username is valid",
            rules
        };
    };

    // Password strength checker
    const checkPasswordStrength = (password) => {
        const requirements = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };

        const metRequirements = Object.values(requirements).filter(Boolean).length;
        const totalRequirements = Object.keys(requirements).length;

        let score = 0;
        let message = "";
        let color = "gray";

        if (password.length === 0) {
            message = "Password not set";
            color = "gray";
        } else if (metRequirements <= 2) {
            score = 0;
            message = "Weak password";
            color = "red";
        } else if (metRequirements === 3 || metRequirements === 4) {
            score = 1;
            message = "Medium password";
            color = "orange";
        } else {
            score = 2;
            message = "Strong password";
            color = "green";
        }

        setPasswordStrength({
            score,
            message,
            color,
            requirements
        });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Real-time validation
        if (name === "password") {
            checkPasswordStrength(value);
        }

        if (name === "username") {
            const validation = validateUsername(value);
            setUsernameValidation({
                isValid: validation.isValid,
                message: validation.message,
                checking: false
            });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setRegistrationCompleted(false);

        const { username, email, password } = formData;

        // Validate all fields
        if (!username || !email || !password) {
            setErrorMessage("❌ Please fill all fields");
            return;
        }

        // Validate username
        const usernameValidationResult = validateUsername(username);
        if (!usernameValidationResult.isValid) {
            setErrorMessage(`❌ Invalid username: ${usernameValidationResult.message}`);
            return;
        }

        // Validate password strength
        if (passwordStrength.score === 0 && password.length > 0) {
            setErrorMessage("❌ Password is too weak. Please choose a stronger password.");
            return;
        }

        setLoading(true);

        const userData = {
            username,
            email,
            password,
        };

        try {
            const checkRes = await axios.post("http://localhost:8789/check-user-exists", {
                email: email,
                username: username,
                phone: userData.phone
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

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                    />

                    <div className="relative z-10 text-center px-10 text-white max-w-sm right-10">

                        <UserRoundPlus className="w-12 h-12 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-3">
                            Be Someone’s Hope

                        </h2>

                        <p className="text-sm text-white/80 leading-relaxed">
                            Your registration is the first step toward saving lives.
                            Join Hope Drip and become part of a community.

                        </p>

                    </div>

                    <div className="absolute bottom-4 right-60 text-white align-items-horizontal flex">
                        <Activity className="w-6 h-6 mt-2 animate-spin-slow text-white" />
                        <Syringe className="w-6 h-6 mt-2 text-white" />
                        <HandHeart className="w-6 h-6 mt-2 text-white" />
                    </div>
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
                        {/* Username field with validation */}
                        <div>
                            <div className="relative border-b-2 border-white/80 pb-1">
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleFormChange}
                                    className="bg-transparent w-full text-white outline-none placeholder:text-white/80 py-2 pr-10"
                                    required
                                />
                                <div className="absolute right-0 bottom-2 flex items-center">
                                    {formData.username && (
                                        usernameValidation.isValid ?
                                            <Check className="text-green-500 w-5 h-5 mr-1" /> :
                                            <X className="text-red-500 w-5 h-5 mr-1" />
                                    )}
                                    <User className="text-white w-5 h-5" />
                                </div>
                            </div>
                            {formData.username && (
                                <div className={`text-sm mt-1 ${usernameValidation.isValid ? 'text-green-400' : 'text-red-400'}`}>
                                    {usernameValidation.message}
                                </div>
                            )}
                        </div>

                        {/* Email field */}
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

                        {/* Password field with strength indicator */}
                        <div>
                            <div className="relative border-b-2 border-white/80 pb-1">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleFormChange}
                                    className="bg-transparent w-full text-white outline-none placeholder:text-white/80 py-2 pr-10"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-8 bottom-2 text-white hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                <Lock className="absolute right-0 bottom-2 text-white w-5 h-5" />
                            </div>

                            {/* Password strength indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-white">Password strength:</span>
                                        <span className={`text-sm font-medium ${passwordStrength.color === 'red' ? 'text-red-400' :
                                            passwordStrength.color === 'orange' ? 'text-yellow-400' :
                                                'text-green-400'
                                            }`}>
                                            {passwordStrength.message}
                                        </span>
                                    </div>

                                    {/* Strength bar */}
                                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                        <div
                                            className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color === 'red' ? 'bg-red-500' :
                                                passwordStrength.color === 'orange' ? 'bg-yellow-500' :
                                                    passwordStrength.color === 'green' ? 'bg-green-500' :
                                                        'bg-gray-500'
                                                }`}
                                            style={{
                                                width: `${passwordStrength.score === 0 ? 33 : passwordStrength.score === 1 ? 66 : 100}%`
                                            }}
                                        ></div>
                                    </div>

                                    {/* Password requirements checklist */}
                                    {/* Password requirements checklist */}
                                    <div className="grid grid-cols-2 gap-1 text-xs">
                                        <div className="flex items-center">
                                            {passwordStrength.requirements.length ?
                                                <Check className="w-3 h-3 text-green-500 mr-1" /> :
                                                <X className="w-3 h-3 text-red-500 mr-1" />}
                                            <span className={passwordStrength.requirements.length ? "text-green-400" : "text-gray-400"}>
                                                At least 8 characters
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            {passwordStrength.requirements.lowercase ?
                                                <Check className="w-3 h-3 text-green-500 mr-1" /> :
                                                <X className="w-3 h-3 text-red-500 mr-1" />}
                                            <span className={passwordStrength.requirements.lowercase ? "text-green-400" : "text-gray-400"}>
                                                Lowercase letter
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            {passwordStrength.requirements.uppercase ?
                                                <Check className="w-3 h-3 text-green-500 mr-1" /> :
                                                <X className="w-3 h-3 text-red-500 mr-1" />}
                                            <span className={passwordStrength.requirements.uppercase ? "text-green-400" : "text-gray-400"}>
                                                Uppercase letter
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            {passwordStrength.requirements.number ?
                                                <Check className="w-3 h-3 text-green-500 mr-1" /> :
                                                <X className="w-3 h-3 text-red-500 mr-1" />}
                                            <span className={passwordStrength.requirements.number ? "text-green-400" : "text-gray-400"}>
                                                Number
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            {passwordStrength.requirements.special ?
                                                <Check className="w-3 h-3 text-green-500 mr-1" /> :
                                                <X className="w-3 h-3 text-red-500 mr-1" />}
                                            <span className={passwordStrength.requirements.special ? "text-green-400" : "text-gray-400"}>
                                                Special character
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !usernameValidation.isValid || (formData.password && passwordStrength.score === 0)}
                            className="w-full py-2 border-2 border-red-600 rounded-full text-white font-bold hover:bg-red-600/20 transition-all text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
