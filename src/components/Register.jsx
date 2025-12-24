import { User, Lock, Mail } from 'lucide-react';

function RegisterForm({ switchToLogin, onRegisterSuccess }) {
    return (
        <div className="flex w-full max-w-[900px] bg-[#0f1221] rounded-md overflow-hidden shadow-lg">
            {/* Left side: Red Diagonal */}
            <div className="w-1/2 relative flex items-center justify-center">
                {/* Red diagonal background */}
                <div
                    className="absolute inset-0 bg-[#8b0000]"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 0 350%)' }}
                ></div>

                {/* Optional overlay for styling */}
                <div className="absolute inset-0 bg-[#0f1221]/0"></div>


            </div>


            {/* Right side: Form */}
            <div className="w-1/2 p-8 flex flex-col justify-center gap-6">
                <h2 className="text-3xl font-bold text-white text-center mb-4">Register</h2>

                <form onSubmit={(e) => { e.preventDefault(); onRegisterSuccess(); }} className="flex flex-col gap-4">
                    <div className="relative border-b-2 border-white/80 pb-1">
                        <input
                            type="text"
                            placeholder="Username"
                            className="bg-transparent w-full text-white outline-none placeholder:text-white/80 py-2"
                        />
                        <User className="absolute right-0 bottom-2 text-white w-5 h-5" />
                    </div>

                    <div className="relative border-b-2 border-white/80 pb-1">
                        <input
                            type="email"
                            placeholder="Email"
                            className="bg-transparent w-full text-white outline-none placeholder:text-white/80 py-2"
                        />
                        <Mail className="absolute right-0 bottom-2 text-white w-5 h-5" />
                    </div>

                    <div className="relative border-b-2 border-white/80 pb-1">
                        <input
                            type="password"
                            placeholder="Password"
                            className="bg-transparent w-full text-white outline-none placeholder:text-white/80 py-2"
                        />
                        <Lock className="absolute right-0 bottom-2 text-white w-5 h-5" />
                    </div>

                    <button className="w-full py-2 border-2 border-red-600 rounded-full text-white font-bold hover:bg-red-600/20 transition-all text-lg mt-4">
                        Register
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-white text-sm mb-2">Already have an account?</p>
                    <button onClick={switchToLogin} className="text-red-600 font-bold hover:underline">Sign In</button>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;
