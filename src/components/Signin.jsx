
import RoundexFont from './fonts/Roundex.otf';
import logo from "./images/1.png";
import { RxCross2 } from "react-icons/rx";

function Signin({onClose}) {
    return (
        <div>
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
                <div className='bg-[#0f1f1f] p-2 rounded-lg h-96 w-80'>
                    <div className='flex justify-end text-2x1'>
                        <h4 className='text-[#e0e8e1] text-2xl cursor-pointer hover:bg-[#234444]' onClick={onClose}><RxCross2 />
</h4>
                    </div>
                    <form action="" className='flex flex-col justify-center items-center'>
                        <div className="flex flex-col items-center gap-2">
                            <img src={logo} alt="Hope Drip Logo" className="w-9 h-8" />
                            <h3 className="text-[#c2d8c4] text-xl font-bold">Hope Drip</h3>
                            <p className='text-gray-400 text-sm'>Sign in to continue</p>
                            <div className='mt-2'>
                                <input type='text' placeholder='Email or Phone' className='h-10 w-72 rounded-lg p-3 outline-none border border-gray-600 bg-transparent text-white mb-3'></input>
                                <input type='password' placeholder='Password' className='h-10 w-72 rounded-lg p-3 outline-none border border-gray-600 bg-transparent text-white'></input>
                            </div>
                            <span className='flex gap-16 mt-3'>
                                <button className='bg-[#c2d8c4] text-[#0f1f1f] font-semibold px-6 py-2 rounded-md hover:bg-[#a8c4a9] transition'>Sign In</button>
                                <button className='bg-transparent text-xs text-gray-400 hover:bg-transparent hover:underline'>Forget Password</button>
                            </span>
                        </div>
                    </form>
                    <div class="text-center text-xs text-gray-500 mt-6">© 2025 Hope Drip. All rights reserved.</div>
                </div>
            </div>
        </div>
    );
}

export default Signin;