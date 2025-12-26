import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './Login';
import RegisterForm from './Register';

function AuthWrapper({ defaultForm = "login", onLoginSuccess, onClose }) {
    const [formType, setFormType] = useState(defaultForm);

    // Flip variants
    const flipVariants = {
        enter: (direction) => ({
            rotateY: direction > 0 ? 90 : -90,
            opacity: 0,
        }),
        center: {
            rotateY: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            rotateY: direction > 0 ? -90 : 90,
            opacity: 0,
        }),
    };

    const handleSwitch = (targetForm) => {
        setFormType(targetForm);
    };

    return (
        <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center p-4 z-50 perspective-[1000px]">
            {/* Outer Glow Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-[900px] min-h-[550px] bg-[#0f1221] rounded-sm overflow-hidden  shadow-[0_0_30px_rgba(220,38,38,0.3)] flex"
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-50 text-white/100 hover:text-white transition-colors">✕</button>

                <AnimatePresence initial={false} mode="wait">
                    {formType === "login" ? (
                        <motion.div
                            key="login"
                            custom={1}
                            variants={flipVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="w-full flex backface-hidden"
                        >
                            <LoginForm switchToRegister={() => handleSwitch("register")} onLoginSuccess={onLoginSuccess} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="register"
                            custom={-1}
                            variants={flipVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="w-full flex backface-hidden"
                        >
                            <RegisterForm switchToLogin={() => handleSwitch("login")} onRegisterSuccess={onLoginSuccess} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default AuthWrapper;
