import { useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import logo from "./images/1.png";

function Signin({ onClose, onLoginSuccess }) { // ✅ 'LoginSuccess' se 'onLoginSuccess' change karo
    const [loginData, setLoginData] = useState({
        identifier: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!loginData.identifier || !loginData.password) {
            setError("Please enter both email/phone and password");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    identifier: loginData.identifier,
                    password: loginData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }

            if (data.message === "Login successful") {
                // ✅ Safe user data storage
                const safeUserData = {
                    id: data.user?.id,
                    name: data.user?.name,
                    email: data.user?.email,
                    phone: data.user?.phone
                };

                localStorage.setItem('user', JSON.stringify(safeUserData));

                // ✅ SUCCESS CALLBACK FIRST
                if (onLoginSuccess) {
                    onLoginSuccess(); // ✅ Pehle callback call karo
                }

                setError("✅ Login successful!");

                // ✅ Phir modal close karo
                setTimeout(() => {
                    onClose();
                }, 1500);
            }
        } catch (error) {
            setError("❌ " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
            <div className='bg-[#0f1f1f] p-6 rounded-lg w-80 relative'>
                <div className='flex justify-end absolute top-3 right-3'>
                    <button
                        className='text-[#e0e8e1] text-xl cursor-pointer hover:bg-[#234444] rounded p-1'
                        onClick={onClose}
                        disabled={loading}
                    >
                        <RxCross2 />
                    </button>
                </div>

                {error && (
                    <div className={`text-center mb-4 p-2 rounded-md text-sm ${error.startsWith("✅")
                            ? "bg-green-700/30 text-green-300"
                            : "bg-red-700/30 text-red-300"
                        }`}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className='flex flex-col justify-center items-center'>
                    <div className="flex flex-col items-center gap-2 w-full">
                        <img src={logo} alt="Hope Drip Logo" className="w-9 h-8" />
                        <h3 className="text-[#c2d8c4] text-xl font-bold">Hope Drip</h3>
                        <p className='text-gray-400 text-sm'>Sign in to continue</p>

                        <div className='mt-4 w-full'>
                            <input
                                type='text'
                                name='identifier'
                                placeholder='Email or Phone'
                                value={loginData.identifier}
                                onChange={handleChange}
                                className='h-10 w-full rounded-lg p-3 outline-none border border-gray-600 bg-transparent text-white mb-3 focus:border-[#c2d8c4]'
                                disabled={loading}
                            />
                            <input
                                type='password'
                                name='password'
                                placeholder='Password'
                                value={loginData.password}
                                onChange={handleChange}
                                className='h-10 w-full rounded-lg p-3 outline-none border border-gray-600 bg-transparent text-white focus:border-[#c2d8c4]'
                                disabled={loading}
                            />
                        </div>

                        <div className='flex justify-between items-center w-full mt-4'>
                            <button
                                type='submit'
                                className='bg-[#c2d8c4] text-[#0f1f1f] font-semibold px-6 py-2 rounded-md hover:bg-[#a8c4a9] transition disabled:opacity-50'
                                disabled={loading}
                            >
                                {loading ? "Signing In..." : "Sign In"}
                            </button>
                            <button
                                type='button'
                                className='bg-transparent text-xs text-gray-400 hover:underline transition-colors'
                                disabled={loading}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </div>
                </form>

                <div className="text-center text-xs text-gray-500 mt-6">
                    © 2025 Hope Drip. All rights reserved.
                </div>
            </div>
        </div>
    );
}

export default Signin;