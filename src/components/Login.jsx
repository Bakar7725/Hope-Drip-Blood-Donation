import { User, Lock } from 'lucide-react';

function LoginForm({ switchToRegister, onLoginSuccess }) {
    return (
        <div className="flex w-full max-w-[900px] bg-[#0f1221] rounded-md overflow-hidden shadow-lg">
            {/* Left side: Form */}
            <div className="w-1/2 p-8 flex flex-col justify-center gap-6">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>

                <form onSubmit={(e) => { e.preventDefault(); onLoginSuccess(); }} className="flex flex-col gap-4">
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
                            type="password"
                            placeholder="Password"
                            className="bg-transparent w-full text-white outline-none placeholder:text-white/80 py-2"
                        />
                        <Lock className="absolute right-0 bottom-2 text-white w-5 h-5" />
                    </div>

                    <button className="w-full py-2 border-2 border-red-600 rounded-full text-white font-bold hover:bg-red-600/20 transition-all text-lg mt-4">
                        Login
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-white text-sm mb-2">Don't have an account?</p>
                    <button onClick={switchToRegister} className="text-red-600 font-bold hover:underline">Sign Up</button>
                </div>
            </div>

            {/* Right side: Red Diagonal */}
            <div className="w-1/2 bg-[#8b0000] relative flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-[#0f1221]"
                    style={{ clipPath: 'polygon(0 0, 0% 200%, 100% 700%)' }}
                ></div>

            </div>
        </div>
    );
}

export default LoginForm;
